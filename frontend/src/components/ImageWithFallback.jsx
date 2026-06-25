const ImageWithFallback = ({ src, alt, className = "", fallback = "https://via.placeholder.com/900x900?text=No+Image", ...props }) => {
  const handleError = (event) => {
    event.target.onerror = null;
    event.target.src = fallback;
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
