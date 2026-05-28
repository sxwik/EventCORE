import { useState } from "react";
import { WebGLCanvas } from "./components/WebGLCanvas";

export default function App() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono text-white selection:bg-red-900 selection:text-white">
      {error ? (
        <div className="absolute inset-0 z-50 p-8 flex flex-col items-center justify-center bg-black/95 text-red-500 font-mono text-center space-y-4">
          <div className="text-2xl md:text-4xl font-bold uppercase tracking-widest animate-pulse border border-red-500 p-4 bg-red-950/20 shadow-[0_0_30px_rgba(255,0,0,0.4)]">
            SYSTEM FAILURE
          </div>
          <p className="max-w-2xl whitespace-pre-wrap">{error}</p>
        </div>
      ) : (
        <>
          <WebGLCanvas onError={setError} />
          
          <div className="absolute top-0 left-0 p-6 z-40 pointer-events-none flex items-center gap-4">
            <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              <img src="/favicon.svg" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest text-white/90 drop-shadow-[0_2px_10px_rgba(255,0,0,0.6)]">EVENT//CORE</h1>
              <p className="text-xs text-white/50 tracking-wider">GPU TORTURE TEST // ONLINE</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
