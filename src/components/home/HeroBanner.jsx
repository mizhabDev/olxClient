import React from "react";

const HeroBanner = () => {
    const handleExploreClick = () => {
  const el = document.getElementById("categories-section");
  if (!el) return;

  const yOffset = -80; // adjust for navbar height
  const y =
    el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};


    return (
        <div className="w-full max-w-4xl mx-auto mt-20 md:mt-20 mb-12">
        
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a2744]/80 to-[#0f172a]/90 border border-white/10 backdrop-blur-xl p-10 md:p-14 text-center">
                {/* Subtle glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-orange-500/10 blur-3xl pointer-events-none" />

                {/* Content */}
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                            Buy & Sell Anything,
                        </span>{" "}
                        <span className="text-white">Anywhere</span>
                    </h1>

                    <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                        Join millions of users buying and selling everything from electronics to furniture. Your local marketplace for great deals and trusted sellers.
                    </p>

                    <button
                        onClick={handleExploreClick}
                        className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                        Start Exploring
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
