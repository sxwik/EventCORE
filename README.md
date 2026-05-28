# EVENT//CORE

> A browser-native volumetric singularity renderer designed to push modern graphics pipelines beyond reasonable limits.

![Status](https://img.shields.io/badge/status-unstable-red)
![GPU](https://img.shields.io/badge/GPU-under%20psychological%20stress-darkred)
![Renderer](https://img.shields.io/badge/renderer-volumetric%20raymarcher-black)
![Runtime](https://img.shields.io/badge/runtime-WebGL2%20%2F%20WebGPU-purple)
![Thermals](https://img.shields.io/badge/thermals-critical-orange)
![Safety](https://img.shields.io/badge/system%20stability-not%20guaranteed-red)
![Reality](https://img.shields.io/badge/reality-integrity%20failing-darkred)

---

# EVENT//CORE

EVENT//CORE is an experimental browser-based volumetric rendering system built to explore the upper boundaries of real-time GPU computation inside consumer browsers.

The project began as:

```txt
"what if trillions of particles existed inside a browser window?"
```

It eventually evolved into:

* volumetric plasma simulation
* framebuffer accumulation experiments
* fractal density field rendering
* hybrid software/GPU ray tracing
* GPU driver stress research
* browser graphics pipeline abuse
* and accidental hardware destabilization

---

# WARNING

This project intentionally executes computationally hostile rendering workloads.

EVENT//CORE may trigger:

* GPU driver resets
* TDR (Timeout Detection and Recovery) crashes
* WebGL/WebGPU context loss
* browser instability
* desktop compositor flickering
* extreme thermal output
* system-wide lag
* temporary display blackouts
* existential concern from integrated graphics hardware

On weaker GPUs, the renderer may fail instantly during initialization.

If the screen flickers black:

```txt
the operating system probably restarted your graphics driver.
```

This is considered normal behavior.

---

# The Illusion of Trillions

EVENT//CORE does NOT render trillions of discrete particles.

That would require impossible amounts of VRAM and memory bandwidth.

Instead, the renderer uses:

* volumetric raymarching
* multi-octave 3D FBM noise
* density field accumulation
* procedural plasma generation
* temporal persistence
* framebuffer feedback

to mathematically simulate the *perception* of infinite particle density.

Every visible pixel becomes a small volumetric simulation.

The result behaves less like a particle engine and more like:

```txt
a continuously sampled cosmic density field
```

---

# Rendering Pipeline

## Volumetric Raymarching

For every pixel on screen:

1. A ray is projected into virtual 3D space
2. The renderer advances through the volume in microscopic increments
3. The density field is sampled repeatedly
4. Fractal noise layers generate plasma structures
5. Surface normals are approximated through spatial derivatives
6. Dynamic lighting calculations are evaluated
7. The result accumulates into a continuous volumetric structure

Current experimental builds may exceed:

```txt
1500+ raymarch iterations per pixel
12-octave fractal density evaluation
multiple lighting passes
recursive framebuffer accumulation
```

---

# Why It Hurts GPUs

Traditional rendering stores objects.

EVENT//CORE stores almost nothing.

Instead, the renderer generates reality mathematically in real-time through procedural evaluation.

This shifts the computational burden away from memory bandwidth and entirely onto:

* shader ALUs
* instruction throughput
* floating point execution
* driver scheduling
* thermal limits
* GPU watchdog systems

The renderer effectively converts the graphics card into:

```txt
a real-time volumetric mathematics engine
```

---

# Driver Failure Events

During development the renderer has successfully triggered:

* AMD driver timeout recovery
* full desktop compositor flickering
* WebGL context destruction
* shader compiler exhaustion
* framebuffer allocation failure
* GPU queue starvation
* browser process instability

At one point the GPU driver reset itself immediately after startup.

This behavior was repeatable.

---

# Browser Safety Systems

Modern browsers actively attempt to prevent projects like this from existing.

Systems encountered during development:

## TDR (Timeout Detection & Recovery)

If the GPU takes too long to finish a frame, Windows assumes the graphics driver has frozen and forcibly resets it.

## WebGL Context Loss

When the browser detects catastrophic GPU instability, it destroys the rendering context to protect the system.

## Shader Validation Limits

Browser shader compilers aggressively reject shaders containing:

* excessive nested loops
* massive unrolled iteration chains
* impossible compile complexity
* resource exhaustion scenarios

This means some builds fail before rendering even begins.

---

# Hybrid Rendering Research

EVENT//CORE currently experiments with combining:

* GPU volumetric rendering
* software-side ray tracing
* procedural density fields
* temporal accumulation
* framebuffer persistence
* recursive light transport

The long-term objective is not realism.

The objective is:

```txt
computational scale
```

---

# Visual Design Philosophy

EVENT//CORE intentionally removes almost all interface elements.

The renderer exists inside:

* a pure black void
* glowing containment borders
* unstable plasma structures
* dense unresolved volumetric masses

The visuals are designed to feel:

* infinite
* unresolved
* computationally dangerous
* physically unstable
* larger than screen resolution itself

---

# Technical Stack

## Runtime

* WebGL2
* WebGPU experiments
* GLSL
* WGSL

## Architecture

* volumetric raymarching
* framebuffer accumulation
* procedural density fields
* multi-octave FBM
* software ray tracing experiments
* GPU-side simulation
* dynamic lighting systems

---

# Performance Notes

This renderer does not stream from cloud servers.

All computation occurs locally on your machine.

Your own hardware performs:

* volumetric simulation
* lighting evaluation
* framebuffer accumulation
* shader execution
* density field traversal
* mathematical plasma reconstruction

Which means:

```txt
your browser temporarily becomes a high-risk rendering engine
```

---

# Current Status

⚠️ EXPERIMENTAL

The renderer is actively unstable.

Performance characteristics vary dramatically depending on:

* GPU architecture
* browser implementation
* driver version
* thermal limits
* operating system watchdog settings
* how much your graphics driver values survival

---

# Known Symptoms

Possible side effects include:

* severe FPS collapse
* browser freezing
* fan speeds approaching aircraft levels
* shader compile failures
* GPU driver recovery events
* desktop flickering
* thermal panic
* Chrome questioning reality

---

# Philosophy

EVENT//CORE exists to answer one question:

```txt
How much mathematics can a browser survive before reality collapses?
```

So far:

```txt
less than expected
```

---

# Built By

**sxwik / Satwik Bajpai**

Powered by:

* procedural chaos
* floating point violence
* framebuffer abuse
* browser exploitation
* and GPU drivers reluctantly cooperating
