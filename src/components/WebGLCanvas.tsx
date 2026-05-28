import { useEffect, useRef } from 'react';

export function WebGLCanvas({ onError }: { onError: (err: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { antialias: false, powerPreference: 'high-performance' });
    if (!gl) {
      onError("WebGL2 is not supported by your browser. SIMULATION OFFLINE.");
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (vsSource: string, fsSource: string) => {
      const vs = compileShader(gl.VERTEX_SHADER, vsSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return null;
      const prog = gl.createProgram();
      if (!prog) return null;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    };

    const vsQuad = `#version 300 es
      in vec4 aPos;
      void main() { gl_Position = aPos; }
    `;

    const fsRaymarch = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      
      uniform vec2 uRes;
      uniform float uTime;

      mat2 rot(float a) {
          float s = sin(a), c = cos(a);
          return mat2(c, -s, s, c);
      }
      
      float hash(float n) { return fract(sin(n) * 43758.5453123); }
      
      // 3D noise
      float noise(vec3 x) {
          vec3 p = floor(x);
          vec3 f = fract(x);
          f = f*f*(3.0-2.0*f);
          float n = p.x + p.y*57.0 + 113.0*p.z;
          return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                         mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                     mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                         mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
      }

      // 100 Trillion particle equivalent - Fractal Brownian Motion
      float fbm(vec3 p) {
          float f = 0.0;
          float w = 0.5;
          // GPU OMEGA MELTER: 40 octaves of heavy 3D noise for microscopic fractal detail
          for (int i = 0; i < 40; i++) {
              f += w * noise(p);
              p *= 2.4;
              p.xy *= rot(0.6);
              p.yz *= rot(0.8);
              w *= 0.45;
          }
          return f;
      }

      float map(vec3 p) {
          vec3 q = p;
          q.xy *= rot(uTime * 0.15);
          q.yz *= rot(uTime * 0.1);
          
          // Create massive twisting nebulas
          float n = fbm(q * 1.5 + vec3(0.0, 0.0, uTime * 0.4));
          
          float d = length(q) - 2.5; // Base sphere
          
          // Erode sphere with noise to create "particles"
          d += n * 3.5;
          
          return d;
      }
      
      // VERY EXPENSIVE normal calculation (calls map() 6 times!)
      vec3 calcNormal(vec3 p) {
          vec2 e = vec2(0.02, 0.0);
          return normalize(vec3(
              map(p + e.xyy) - map(p - e.xyy),
              map(p + e.yxy) - map(p - e.yxy),
              map(p + e.yyx) - map(p - e.yyx)
          ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;
        
        vec3 ro = vec3(0.0, 0.0, -8.5);
        vec3 rd = normalize(vec3(uv, 1.0));
        
        // Random ray jitter for fuzzy massive particle feel (Temporal anti-aliasing conceptually)
        float jitter = hash(gl_FragCoord.x * 13.0 + gl_FragCoord.y * 71.0 + uTime * 100.0);
        
        float t = jitter * 0.1;
        vec3 col = vec3(0.0);
        float density = 0.0;
        
        // EXTREME GPU STRESS TEST: 50000 steps of volumetrics with micro step sizes
        for(int i = 0; i < 50000; i++) {
            vec3 p = ro + rd * t;
            float d = map(p);
            
            if(d < 0.0) {
                // Ray is inside the particle volume
                // Extremely dense particle accumulation
                float localDensity = -d * 0.08;
                density += localDensity;
                
                // EXTREME STRESS: Calculate normal while inside the volume for 3D lighting!
                // This forces the GPU to call map() 6 more times per internal step!
                vec3 n = calcNormal(p);
                
                // MULTIPLE LIGHTS STRESS TEST
                vec3 lightDir1 = normalize(vec3(sin(uTime * 2.0) * 5.0, cos(uTime * 1.5) * 5.0, 3.0) - p);
                vec3 lightDir2 = normalize(vec3(cos(uTime * 1.0) * 5.0, sin(uTime * 2.5) * 5.0, -3.0) - p);
                vec3 lightDir3 = normalize(vec3(sin(uTime * 3.0) * 3.0, cos(uTime * 3.0) * 3.0, 0.0) - p);
                
                float diff1 = max(dot(n, lightDir1), 0.0);
                float spec1 = pow(max(dot(reflect(-lightDir1, n), -rd), 0.0), 32.0);
                
                float diff2 = max(dot(n, lightDir2), 0.0);
                float spec2 = pow(max(dot(reflect(-lightDir2, n), -rd), 0.0), 32.0);
                
                float diff3 = max(dot(n, lightDir3), 0.0);
                float spec3 = pow(max(dot(reflect(-lightDir3, n), -rd), 0.0), 32.0);
                
                // SECONDARY RAY TRACING (GLOBAL ILLUMINATION / AMBIENT RAY CASTING)
                // This will cast 25 extra rays per intersection per step inside the fractal volume!
                float gi = 0.0;
                for(int r = 0; r < 25; r++) {
                    vec3 rayDir = normalize(n + vec3(hash(float(r)), hash(float(r)+1.0), hash(float(r)+2.0)) - 0.5);
                    gi += map(p + rayDir * 0.5) * 0.05;
                }
                
                vec3 colorTheme = mix(
                    vec3(1.0, 0.1, 0.0), // Core heat (Red/Orange)
                    vec3(0.0, 0.6, 1.0), // Outer plasma (Cyan/Blue)
                    smoothstep(-1.0, 1.0, d + noise(p * 2.0))
                );
                
                col += colorTheme * localDensity * ((diff1 + diff2 + diff3) * 0.8 + 0.2 + abs(gi)) + (spec1 + spec2 + spec3) * 0.15;
            }
            
            // Advance ray - microscopic steps inside for absolute extreme overload
            t += max(d * 0.01, 0.002);
            
            if(t > 15.0 || density > 2.0) break;
        }
        
        col = mix(col, vec3(2.0, 1.5, 1.2), smoothstep(1.5, 2.0, density));
        
        fragColor = vec4(col, 1.0);
      }
    `;

    const fsComposite = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 uRes;
      uniform sampler2D uTexNew;
      uniform sampler2D uTexOld;

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        vec2 center = vec2(0.5);
        
        vec2 dir = uv - center;
        float dist = length(dir);
        float angle = -0.01 * smoothstep(0.0, 1.0, dist); 
        float s = sin(angle), c = cos(angle);
        vec2 rotDir = vec2(dir.x * c - dir.y * s, dir.x * s + dir.y * c);
        
        vec2 trailUV = center + rotDir * 0.985; // zoom inwards
        
        vec4 newFrame = texture(uTexNew, uv);
        vec4 oldFrame = texture(uTexOld, trailUV);
        
        vec3 col = newFrame.rgb + oldFrame.rgb * 0.95; // persistence trails
        
        fragColor = vec4(col, 1.0);
      }
    `;

    const fsScreen = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 uRes;
      uniform sampler2D uTex;

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes.xy;
        vec3 col = texture(uTex, uv).rgb;
        
        // Massive over-exposure bloom / tonemap
        vec3 exposed = col * 2.5; 
        col = (exposed * (exposed + 0.5)) / (exposed * (exposed + 1.2) + 0.2); 
        
        float dist = distance(uv, vec2(0.5));
        col *= smoothstep(1.2, 0.2, dist);
        
        fragColor = vec4(col, 1.0);
      }
    `;

    const prgRaymarch = createProgram(vsQuad, fsRaymarch);
    const prgComposite = createProgram(vsQuad, fsComposite);
    const prgScreen = createProgram(vsQuad, fsScreen);

    if (!prgRaymarch || !prgComposite || !prgScreen) {
      onError("Failed to compile shaders.");
      return;
    }

    const quadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1
    ]), gl.STATIC_DRAW);

    const setupVAO = (prog: WebGLProgram) => {
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);
      return vao;
    };

    const vaoRaymarch = setupVAO(prgRaymarch);
    const vaoComposite = setupVAO(prgComposite);
    const vaoScreen = setupVAO(prgScreen);

    let w = 1, h = 1;
    let texRay: WebGLTexture, fboRay: WebGLFramebuffer;
    let texA: WebGLTexture, fboA: WebGLFramebuffer;
    let texB: WebGLTexture, fboB: WebGLFramebuffer;

    gl.getExtension('EXT_color_buffer_float');

    const createTexFBO = () => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, (gl as any).RGBA16F || gl.RGBA, w, h, 0, gl.RGBA, (gl as any).HALF_FLOAT || gl.UNSIGNED_BYTE, null);
      } catch(e) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      
      const f = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      return { t, f };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);

      if (texRay) gl.deleteTexture(texRay);
      if (fboRay) gl.deleteFramebuffer(fboRay);
      if (texA) gl.deleteTexture(texA);
      if (fboA) gl.deleteFramebuffer(fboA);
      if (texB) gl.deleteTexture(texB);
      if (fboB) gl.deleteFramebuffer(fboB);

      let r = createTexFBO(); texRay = r.t; fboRay = r.f;
      let a = createTexFBO(); texA = a.t; fboA = a.f;
      let b = createTexFBO(); texB = b.t; fboB = b.f;
    };
    resize();
    window.addEventListener('resize', resize);

    const locRayRes = gl.getUniformLocation(prgRaymarch, "uRes");
    const locRayTime = gl.getUniformLocation(prgRaymarch, "uTime");
    const locCompRes = gl.getUniformLocation(prgComposite, "uRes");
    const locCompNew = gl.getUniformLocation(prgComposite, "uTexNew");
    const locCompOld = gl.getUniformLocation(prgComposite, "uTexOld");
    const locScreenRes = gl.getUniformLocation(prgScreen, "uRes");
    const locScreenTex = gl.getUniformLocation(prgScreen, "uTex");

    let startTime = performance.now();
    let frameId: number;
    let isA = true;

    const render = () => {
      let time = (performance.now() - startTime) / 1000.0;

      gl.bindFramebuffer(gl.FRAMEBUFFER, fboRay);
      gl.viewport(0, 0, w, h);
      gl.useProgram(prgRaymarch);
      gl.uniform2f(locRayRes, w, h);
      gl.uniform1f(locRayTime, time);
      gl.bindVertexArray(vaoRaymarch);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      const writeFBO = isA ? fboA : fboB;
      const readTex = isA ? texB : texA;
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO);
      gl.useProgram(prgComposite);
      gl.uniform2f(locCompRes, w, h);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texRay);
      gl.uniform1i(locCompNew, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, readTex);
      gl.uniform1i(locCompOld, 1);

      gl.bindVertexArray(vaoComposite);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(prgScreen);
      gl.uniform2f(locScreenRes, w, h);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, isA ? texA : texB);
      gl.uniform1i(locScreenTex, 0);
      
      gl.bindVertexArray(vaoScreen);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      isA = !isA; 

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [onError]);

  return <canvas ref={canvasRef} className="block w-full h-full bg-black cursor-crosshair" />;
}
