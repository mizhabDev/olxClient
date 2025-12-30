import React from "react";

const BackgroundUI = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#000814]">
      {/* Top Right – Blue Ball */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[10px] pointer-events-none" />
      <div className="absolute top-[5%] right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 opacity-60 blur-3xl pointer-events-none" />

      {/* Ambient Accent – Purple / Teal Glow */}
      <div
        className="
    absolute 
    top-[-5%] 
    left-[-8%] 
    w-[420px] 
    h-[420px] 
    rounded-full 
    bg-purple-500/20 
    blur-[140px] 
    pointer-events-none
  "
      />

      <div
        className="
    absolute 
    top-[-1%] 
    left-[30%]
    w-[280px] 
    h-[280px] 
    rounded-full 
    bg-gradient-to-br 
    from-teal-400 
    via-cyan-500 
    to-blue-600 
    opacity-50 
    blur-xl 
    pointer-events-none
  "
      />


      {/* Bottom Left – Orange Ball */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[10px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-60 blur-3xl pointer-events-none" />

      {/* Top Left – Yellow Accent Ball */}
      <div className="absolute top-[10%] left-[20%] w-48 h-48 rounded-full bg-yellow-500/10 blur-[20px] pointer-events-none" />
    </div>
  );
};

export default BackgroundUI;
