const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductCard({ product, onClick }) {
  // 🔒 Normalize image source safely
  let imageSrc = "/placeholder.png";

  if (
    Array.isArray(product.productPhotoSrc) &&
    product.productPhotoSrc.length > 0
  ) {
    const rawSrc = product.productPhotoSrc[0];

    imageSrc = rawSrc.startsWith("http")
      ? rawSrc
      : `${BACKEND_URL}${rawSrc}`;
  }

  if (!product) return (<div className="text-gray-400">No product found</div>);

  return (
    <div
      onClick={() => { onClick(product._id) }}

      className="group relative bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={product.productName}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent opacity-60"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-purple-500/20">
          {product.productCatogery}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 bg-[#1e293b]/40">
        <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-orange-400 transition-colors">
          {product.productName}
        </h3>

        <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-4">
          ₹{product.productPrice}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-400 border-t border-slate-700/50 pt-4">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              className="text-orange-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate max-w-[100px]">{product.productLocation}</span>
          </span>

          <span className="text-xs text-gray-500 bg-[#0f172a]/50 px-2 py-1 rounded-md">
            {product.postedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
