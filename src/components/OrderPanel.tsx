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
  const [longPressProgress, setLongPressProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const LONG_PRESS_DURATION = 5000; // 5 seconds

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

  const isLongPress = useRef(false);

  const handleTrashStart = () => {
    isLongPress.current = false;
    setLongPressProgress(0);
    const startTime = Date.now();
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
      setLongPressProgress(progress);
      
      if (elapsed >= LONG_PRESS_DURATION) {
        isLongPress.current = true;
        onClear();
        handleTrashEnd();
      }
    }, 50);
  };

  const handleTrashEnd = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = null;
    // Don't reset progress immediately so onClick can check it
    setTimeout(() => setLongPressProgress(0), 100);
  };

  const handleTrashClick = () => {
    if (!isLongPress.current && selectedId) {
      onRemove(selectedId);
      setSelectedId(null);
    }
  };

  return (
    <div className="w-full lg:w-[580px] h-full max-h-full bg-white border-l border-zinc-200 flex flex-col overflow-hidden relative">
      <div className="h-40 px-8 border-b border-zinc-200 flex items-center justify-between bg-white z-10 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight leading-none mb-1">Current Order</h2>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Order #8429 • Today</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => moveSelection('up')} className="w-14 h-14 text-zinc-400 hover:text-zinc-900">
            <ChevronUp className="w-10 h-10 stroke-[3]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveSelection('down')} className="w-14 h-14 text-zinc-400 hover:text-zinc-900">
            <ChevronDown className="w-10 h-10 stroke-[3]" />
          </Button>
          
          <div className="relative ml-2">
            <Button 
              variant="ghost" 
              size="icon"
              onPointerDown={handleTrashStart}
              onPointerUp={handleTrashEnd}
              onPointerLeave={handleTrashEnd}
              onClick={handleTrashClick}
              className={`w-16 h-16 transition-all relative overflow-hidden rounded-2xl border-2 ${
                selectedId 
                  ? 'text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200' 
                  : 'text-zinc-200 border-zinc-50 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-8 h-8 stroke-[2.5] relative z-10" />
              {longPressProgress > 0 && (
                <div 
                  className="absolute bottom-0 left-0 w-full bg-red-200 transition-all duration-75"
                  style={{ height: `${longPressProgress}%` }}
                />
              )}
            </Button>
          </div>
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
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-[8px] font-black text-zinc-300 shrink-0 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-[12px] font-black tracking-tight truncate text-zinc-900">
                        {item.name.toUpperCase()}
                      </h4>
                    </div>
                    
                    <div className="flex items-center shrink-0">
                      <span className="text-[14px] font-black tabular-nums text-zinc-900">
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
      <div className="p-4 bg-white border-t border-zinc-200 flex flex-col gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[8px] font-black uppercase tracking-widest">Subtotal</span>
            <span className="text-[12px] font-black tabular-nums">${subtotal.toFixed(2)}</span>
          </div>
          
          {discounts.length > 0 && (
            <div className="flex flex-col gap-1 py-1 border-y border-zinc-50">
              {discounts.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-orange-600">
                  <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Tag className="w-3 h-3 stroke-[3]" />
                    {d.label}
                  </span>
                  <span className="text-[12px] font-black tabular-nums">
                    -{d.type === 'percentage' ? `${d.value}%` : `$${d.value.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-[8px] font-black uppercase tracking-widest">Tax (8%)</span>
            <span className="text-[12px] font-black tabular-nums">${tax.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          onClick={onCheckout}
          className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[14px] rounded-xl shadow-xl shadow-zinc-200 active:scale-[0.98] transition-all"
        >
          COMPLETE CHECKOUT
        </Button>

        <div className="flex justify-between items-end pt-1">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total</span>
            <div className="flex items-center gap-3">
              <span className="text-[24px] font-black text-orange-500 tabular-nums tracking-tighter leading-none">${total.toFixed(2)}</span>
              <span className="text-[14px] font-black text-zinc-200">—</span>
              <span className="text-[14px] font-black text-zinc-400 tabular-nums leading-none">{itemCount} ITEMS</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
