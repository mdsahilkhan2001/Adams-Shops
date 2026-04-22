import { useParams } from "react-router-dom";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { useGetProductQuery } from "../store/api.js";
import { products } from "../data/mockData.js";
import ProductCard from "../components/ProductCard.jsx";
import { formatPrice, getPrimaryImage } from "../utils/format.js";
import { addToCart } from "../store/cartSlice.js";

const sizes = ["S", "M", "L", "XL"];
const colors = ["Midnight", "Emerald", "Sand", "Gold"];

const Product = () => {
  const { id } = useParams();
  const { data } = useGetProductQuery(id);
  const fallback = products.find((item) => String(item.id) === String(id)) || products[0];
  const product = data || fallback;
  const dispatch = useDispatch();
  const image = getPrimaryImage(product);
  const category = product.category_name || product.category;
  const thumbnails =
    product.images?.length > 0
      ? product.images
      : [1, 2, 3].map(() => ({ image_url: image, alt_text: product.name }));
  const [activeSize, setActiveSize] = useState(sizes[1]);
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) {
    return null;
  }

  return (
    <div className="lux-container py-16 space-y-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="grid gap-4">
          <div className="group overflow-hidden rounded-3xl border border-black/10">
            <img
              src={image}
              alt={product.name}
              className="h-[480px] w-full object-cover transition duration-500 group-hover:scale-110"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {thumbnails.slice(0, 3).map((item, index) => (
              <div key={`${item.image_url}-${index}`} className="overflow-hidden rounded-2xl border border-black/10">
                <img
                  src={item.image_url}
                  alt={item.alt_text || product.name}
                  className="h-28 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">{category}</p>
          <h1 className="font-display text-3xl md:text-4xl">{product.name}</h1>
          <p className="text-gold text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="text-sand">
            Crafted in premium fabric with intricate Islamic detailing. Designed for comfort and
            elegance during sacred gatherings.
          </p>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-sand">Size</p>
            <div className="flex gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setActiveSize(size)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                    activeSize === size
                      ? "border-gold bg-gold text-obsidian"
                      : "border-black/20 text-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-sand">Color</p>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setActiveColor(color)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                    activeColor === color
                      ? "border-gold bg-gold text-obsidian"
                      : "border-black/20 text-ink"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              className="lux-button"
              onClick={() =>
                dispatch(
                  addToCart({
                    ...product,
                    selected_size: activeSize,
                    selected_color: activeColor
                  })
                )
              }
            >
              Add to Cart
            </button>
            <button className="lux-outline">Quick View</button>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink hover:border-gold/60"
            >
              Size Guide
            </button>
            <button className="rounded-full border border-black/20 p-3 text-ink hover:border-gold/60">
              <Heart size={18} />
            </button>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-sand">
            Size guide available. Complimentary gift wrap on orders above INR 2999.
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-display text-2xl">Related Products</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>

      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 p-6">
          <div className="max-w-lg w-full rounded-3xl border border-black/10 bg-white p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Size Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em]"
              >
                Close
              </button>
            </div>
            <p className="text-sand text-sm">
              Our abayas are designed for an elegant drape. Choose a size based on your height and
              preferred fit. For assistance, WhatsApp our concierge.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-black/10 p-3">S: 52-54 in</div>
              <div className="rounded-2xl border border-black/10 p-3">M: 54-56 in</div>
              <div className="rounded-2xl border border-black/10 p-3">L: 56-58 in</div>
              <div className="rounded-2xl border border-black/10 p-3">XL: 58-60 in</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
