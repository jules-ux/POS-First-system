import { motion } from "motion/react";
import { Product, PRODUCTS } from "@/src/types";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  return (
    <div className="flex-1 flex flex-col p-4 gap-4 bg-zinc-50/30 overflow-hidden">
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 overflow-y-auto pr-2 custom-scrollbar">
        {PRODUCTS.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
          >
            <button 
              className="w-full aspect-square p-2 flex items-center justify-center text-center bg-white border border-zinc-200 rounded-lg hover:border-zinc-400 hover:bg-zinc-50 active:bg-zinc-100 group transition-none shadow-sm"
              onClick={() => onAddToCart(product)}
            >
              <span className="font-bold text-zinc-700 text-[10px] sm:text-xs leading-tight group-hover:text-zinc-900">
                {product.name}
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
