import { motion } from "motion/react";
import { Product, PRODUCTS } from "@/src/types";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  selectedCategory: string;
}

export function ProductGrid({ onAddToCart, selectedCategory }: ProductGridProps) {
  const filteredProducts = PRODUCTS
    .filter(p => p.category === selectedCategory)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex-1 flex flex-col p-2 gap-2 bg-zinc-50/30 overflow-hidden">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
          >
            <button 
              className="w-full aspect-square p-2 flex items-center justify-center text-center bg-white border border-zinc-200 rounded-none hover:border-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 group transition-none shadow-sm active:scale-[0.98]"
              onClick={() => onAddToCart(product)}
            >
              <span className="font-bold font-display text-zinc-900 text-[10px] sm:text-xs lg:text-sm leading-tight uppercase tracking-tight">
                {product.name}
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
