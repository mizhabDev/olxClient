

export default function ProductCard({ product }) {
  return (
    <div className="product-card card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
        <div className="product-badge">{product.category}</div>
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
        <div className="product-meta">
          <span className="product-location">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
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
            {product.location}
          </span>
          <span className="product-date">{product.postedDate}</span>
        </div>
      </div>
    </div>
  );
}
