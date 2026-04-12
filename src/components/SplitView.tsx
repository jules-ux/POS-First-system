import { CartItem } from "@/src/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplitViewProps {
  mainCart: CartItem[];
  splitCart: CartItem[];
  onMoveToSplit: (item: CartItem, qty: number) => void;
  onMoveToMain: (item: CartItem, qty: number) => void;
  onPaySplit: () => void;
  onCancel: () => void;
}

export function SplitView({ 
  mainCart, 
  splitCart, 
  onMoveToSplit, 
  onMoveToMain, 
  onPaySplit, 
  onCancel 
}: SplitViewProps) {
  const [pendingMove, setPendingMove] = useState<{ item: CartItem; direction: 'toSplit' | 'toMain' } | null>(null);
  const [moveQty, setMoveQty] = useState("");

  const handleItemClick = (item: CartItem, direction: 'toSplit' | 'toMain') => {
    if (item.quantity > 1) {
      setPendingMove({ item, direction });
      setMoveQty("");
    } else {
      if (direction === 'toSplit') onMoveToSplit(item, 1);
      else onMoveToMain(item, 1);
    }
  };

  const confirmMove = () => {
    if (!pendingMove) return;
    const qty = parseInt(moveQty) || 1;
    const finalQty = Math.min(qty, pendingMove.item.quantity);
    
    if (pendingMove.direction === 'toSplit') onMoveToSplit(pendingMove.item, finalQty);
    else onMoveToMain(pendingMove.item, finalQty);
    
    setPendingMove(null);
  };

  const splitTotal = splitCart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.08;

  return (
    <div className="flex-1 flex bg-zinc-50 overflow-hidden relative">
      {/* Left Column: Main Order */}
      <div className="flex-1 flex flex-col border-r border-zinc-200 bg-white">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Main Order</h3>
          <span className="text-xs font-bold text-zinc-400">{mainCart.length} items</span>
        </div>
        <ScrollArea className="flex-1 min-h-0" viewportClassName="snap-y snap-mandatory">
          <div className="p-4 space-y-2">
            {mainCart.map((item) => (
              <button
                key={item.cartItemId}
                onClick={() => handleItemClick(item, 'toSplit')}
                className="w-full p-4 rounded-2xl border border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 flex justify-between items-center group transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-zinc-900 tabular-nums">{item.quantity}x</span>
                  <span className="text-xl font-black tracking-tight text-zinc-900">{item.name.toUpperCase()}</span>
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-200 group-hover:text-zinc-900" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Column: Split Order */}
      <div className="flex-1 flex flex-col bg-zinc-50/50">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-white">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Partial Bill</h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400 hover:text-red-500 font-bold uppercase tracking-widest text-xs">
            <XCircle className="w-5 h-5 mr-2" />
            Cancel
          </Button>
        </div>
        <ScrollArea className="flex-1 min-h-0" viewportClassName="snap-y snap-mandatory">
          <div className="p-4 space-y-2">
            {splitCart.map((item) => (
              <button
                key={item.cartItemId}
                onClick={() => handleItemClick(item, 'toMain')}
                className="w-full p-4 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-900 flex justify-between items-center group transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-zinc-200 group-hover:text-zinc-900" />
                <div className="flex items-center gap-4 text-right">
                  <span className="text-xl font-black tracking-tight text-zinc-900">{item.name.toUpperCase()}</span>
                  <span className="text-xl font-black text-zinc-900 tabular-nums">{item.quantity}x</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-white border-t border-zinc-200 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Partial Total</span>
            <span className="text-4xl font-black text-orange-500 tabular-nums tracking-tighter">${splitTotal.toFixed(2)}</span>
          </div>
          <Button 
            disabled={splitCart.length === 0}
            onClick={onPaySplit}
            className="w-full h-20 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xl rounded-2xl shadow-lg disabled:opacity-50"
          >
            <CheckCircle2 className="w-6 h-6 mr-3" />
            PAY PARTIAL BILL
          </Button>
        </div>
      </div>

      {/* Quantity Popup */}
      <AnimatePresence>
        {pendingMove && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-10"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl flex flex-col gap-8"
            >
              <div className="text-center">
                <h4 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Split Quantity</h4>
                <p className="text-3xl font-black text-zinc-900 tracking-tight">How many {pendingMove.item.name}?</p>
                <p className="text-zinc-400 mt-2">Available: {pendingMove.item.quantity}</p>
              </div>

              <div className="bg-zinc-50 rounded-3xl p-8 flex items-center justify-center">
                <span className="text-7xl font-black text-zinc-900 tabular-nums">{moveQty || "0"}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    className="h-20 text-2xl font-black rounded-2xl border-zinc-100 hover:border-zinc-900"
                    onClick={() => {
                      if (val === "C") setMoveQty("");
                      else setMoveQty(prev => prev + val);
                    }}
                  >
                    {val}
                  </Button>
                ))}
                <Button
                  className="h-20 bg-zinc-900 text-white rounded-2xl font-black text-xl"
                  onClick={confirmMove}
                >
                  OK
                </Button>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setPendingMove(null)}
                className="text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest"
              >
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
