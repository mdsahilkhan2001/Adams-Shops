import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice.js";
import { toggleWishlist } from "../store/wishlistSlice.js";
import { formatPrice, getPrimaryImage } from "../utils/format.js";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const image = getPrimaryImage(product);
  const category = product.category_name || product.category;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"></div>
        <button className="absolute bottom-4 left-4 rounded-full border border-black/40 bg-paper/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink opacity-0 transition duration-500 group-hover:opacity-100">
          Quick View
        </button>
        <button
          onClick={() => dispatch(toggleWishlist(product))}
          className="absolute right-4 top-4 rounded-full border border-black/30 bg-paper/60 p-2 text-ink hover:text-gold"
        >
          <Heart size={16} />
        </button>
      </div>
      <div className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-sand">{category}</p>
        <h3 className="font-display text-lg">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-gold font-semibold">{formatPrice(product.price)}</p>
          <button
            onClick={() => dispatch(addToCart(product))}
            className="rounded-full border border-gold/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink hover:bg-gold hover:text-obsidian"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
