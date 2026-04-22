import { motion } from "framer-motion";

const CategoryCard = ({ category }) => {
  const image = category.image || category.image_url;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white"
    >
      <img
        src={image}
        alt={category.name}
        className="h-48 w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent"></div>
      <div className="absolute bottom-4 left-4">
        <span className="rounded-full border border-black/20 bg-paper/70 px-4 py-2 text-sm uppercase tracking-[0.2em] text-ink">
          {category.name}
        </span>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
