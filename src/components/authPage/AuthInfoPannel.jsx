import React from "react";

const AuthInfoPanel = () => (
  <div className="hidden lg:flex flex-col justify-between w-1/2 p-10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
        
    <div className="z-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="font-bold text-slate-900 text-lg">OLX</span>
        </div>
        <span className="text-3xl font-bold text-white tracking-wide">OLX</span>
      </div>
      <h1 className="text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
        Buy & Sell <br />
        <span className="text-blue-400">Anything, Anywhere</span>
      </h1>
      <p className="text-gray-300 text-lg leading-relaxed max-w-md">
        Join millions of users buying and selling everything from electronics to furniture.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
      <div>
        <h3 className="text-3xl font-bold text-white mb-1">10M+</h3>
        <p className="text-gray-400 text-sm">Active Users</p>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white mb-1">50M+</h3>
        <p className="text-gray-400 text-sm">Listings</p>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white mb-1">200+</h3>
        <p className="text-gray-400 text-sm">Categories</p>
      </div>
    </div>
  </div>
);

export default AuthInfoPanel;