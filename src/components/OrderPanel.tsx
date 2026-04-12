import { Trash2, Plus, Minus, UserPlus, CreditCard, Wallet, Banknote, ChevronUp, ChevronDown, Edit3, Copy, MessageSquare, BookOpen, UserCheck, XCircle, Tag } from "lucide-react";
import { CartItem } from "@/src/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";

interface OrderPanelProps {
  cart: CartItem[];
  discounts: { type: 'percentage' | 'fixed', value: number, label: string }[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemove: (cartItemId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export function OrderPanel({ cart, discounts, onUpdateQuantity, onRemove, onClear, onCheckout }: OrderPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const discountAmount = discounts.reduce((acc, d) => {
    if (d.type === 'percentage') return acc + (subtotal * (d.value / 100));
    return acc + d.value;
  }, 0);

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + tax;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const selectedIndex = cart.findIndex(item => item.cartItemId === selectedId);

  useEffect(() => {
    if (selectedId) {
      const element = itemRefs.current.get(selectedId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedId]);

  const moveSelection = (direction: 'up' | 'down') => {
    if (cart.length === 0) return;
    if (selectedId === null) {
      setSelectedId(cart[0].cartItemId);
      return;
    }
    const newIndex = direction === 'up' 
      ? Math.max(0, selectedIndex - 1) 
      : Math.min(cart.length - 1, selectedIndex + 1);
    setSelectedId(cart[newIndex].cartItemId);
  };

  return (
    <div className="w-full lg:w-[480px] h-full max-h-full bg-white border-l border-zinc-200 flex flex-col overflow-hidden relative">
      <div className="p-8 border-b border-zinc-200 flex items-center justify-between bg-white z-10 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Current Order</h2>
          <p className="text-base text-zinc-400 font-bold">Order #8429 • Today</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => moveSelection('up')} className="w-16 h-16 text-zinc-400 hover:text-zinc-900">
            <ChevronUp className="w-12 h-12 stroke-[3]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveSelection('down')} className="w-16 h-16 text-zinc-400 hover:text-zinc-900">
            <ChevronDown className="w-12 h-12 stroke-[3]" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-zinc-400 hover:text-red-500 ml-4 font-black uppercase tracking-widest text-sm">
            Clear
          </Button>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0" viewportClassName="snap-y snap-mandatory">
        <div className="py-0">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0 }}
                className="text-center py-40"
              >
                <p className="text-zinc-300 font-bold text-xl">No items in order</p>
              </motion.div>
            ) : (
              cart.map((item, index) => (
                <motion.div
                  key={item.cartItemId}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.cartItemId, el);
                    else itemRefs.current.delete(item.cartItemId);
                  }}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0 }}
                  onPointerEnter={() => setSelectedId(item.cartItemId)}
                  onClick={() => setSelectedId(item.cartItemId)}
                  className={`w-full px-8 py-4 cursor-pointer transition-none relative group border-b border-zinc-50 snap-start snap-always ${
                    selectedId === item.cartItemId ? "bg-zinc-100" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <span className="text-xs font-black text-zinc-300 shrink-0 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-2xl font-black tracking-tight truncate text-zinc-900">
                        {item.name.toUpperCase()}
                      </h4>
                    </div>
                    
                    <div className="flex items-center shrink-0">
                      <span className="text-3xl font-black tabular-nums text-zinc-900">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Fixed Footer */}
      <div className="p-8 bg-white border-t border-zinc-200 flex flex-col gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] shrink-0">
        {discounts.length > 0 && (
          <div className="flex flex-col gap-3">
            {discounts.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-orange-600">
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                  <Tag className="w-4 h-4 stroke-[3]" />
                  {d.label}
                </span>
                <span className="text-lg font-black tabular-nums">
                  -{d.type === 'percentage' ? `${d.value}%` : `$${d.value.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        )}

        <Button 
          onClick={onCheckout}
          className="w-full h-24 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-2xl rounded-[2rem] shadow-xl shadow-zinc-200 active:scale-[0.98] transition-all"
        >
          COMPLETE CHECKOUT
        </Button>

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-base font-black text-zinc-400 uppercase tracking-widest mb-2">Total</span>
            <div className="flex items-center gap-4">
              <span className="text-6xl font-black text-orange-500 tabular-nums tracking-tighter">${total.toFixed(2)}</span>
              <span className="text-3xl font-black text-zinc-200">—</span>
              <span className="text-3xl font-black text-zinc-400 tabular-nums">{itemCount} ITEMS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
