import { CartItem } from "@/src/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplitViewProps {
  mainCart: CartItem[];
  splitCart: CartItem[];
  exitRequested?: boolean;
  onMoveToSplit: (item: CartItem, qty: number) => void;
  onMoveToMain: (item: CartItem, qty: number) => void;
  onPaySplit: () => void;
  onCancel: () => void;
  onConfirmExit?: () => void;
  onCancelExit?: () => void;
}

export function SplitView({ 
  mainCart, 
  splitCart, 
  exitRequested = false,
  onMoveToSplit, 
  onMoveToMain, 
  onPaySplit, 
  onCancel,
  onConfirmExit,
  onCancelExit
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
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center shrink-0">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Main Order</h3>
          <span className="text-xs font-bold text-zinc-400">{mainCart.length} items</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-2">
            {mainCart.map((item) => (
              <button
                key={item.cartItemId}
                onClick={() => handleItemClick(item, 'toSplit')}
                className="w-full p-5 rounded-2xl border-2 border-zinc-50 bg-white hover:border-zinc-900 shadow-sm flex justify-between items-center group transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-zinc-900 tabular-nums">{item.quantity}x</span>
                  <span className="text-xl font-black tracking-tight text-zinc-900">{item.name.toUpperCase()}</span>
                </div>
                <ArrowRight className="w-6 h-6 text-zinc-200 group-hover:text-zinc-900 stroke-[2.5]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Split Order (Wider Gray Area) */}
      <div className="flex-[1.4] flex flex-col bg-zinc-100/50">
        <div className="p-8 border-b border-zinc-200 flex justify-between items-center bg-white shrink-0">
          <div className="space-y-1">
            <h3 className="text-base font-black text-zinc-900 uppercase tracking-widest">Partial Bill</h3>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Items to be paid separately</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400 hover:text-red-500 font-black uppercase tracking-widest text-sm">
            <XCircle className="w-6 h-6 mr-2 stroke-[2.5]" />
            Cancel
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-3">
            {splitCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 rounded-[2rem] gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <ArrowRight className="w-10 h-10 text-zinc-200" />
                </div>
                <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">Transfer items here</p>
              </div>
            ) : (
              splitCart.map((item) => (
                <button
                  key={item.cartItemId}
                  onClick={() => handleItemClick(item, 'toMain')}
                  className="w-full p-6 rounded-2xl border-2 border-white bg-white hover:border-zinc-900 shadow-sm flex justify-between items-center group transition-all"
                >
                  <ArrowLeft className="w-6 h-6 text-zinc-200 group-hover:text-zinc-900 stroke-[2.5]" />
                  <div className="flex items-center gap-4 text-right">
                    <span className="text-xl font-black tracking-tight text-zinc-900">{item.name.toUpperCase()}</span>
                    <span className="text-3xl font-black text-orange-500 tabular-nums">{item.quantity}x</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        
        <div className="p-8 bg-white border-t border-zinc-200 flex flex-col gap-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] shrink-0">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-sm font-black text-zinc-400 uppercase tracking-widest block">Partial Total</span>
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Including 8% Tax</span>
            </div>
            <span className="text-6xl font-black text-orange-500 tabular-nums tracking-tighter">${splitTotal.toFixed(2)}</span>
          </div>
          <Button 
            disabled={splitCart.length === 0}
            onClick={onPaySplit}
            className="w-full h-24 bg-orange-500 hover:bg-orange-600 text-white font-black text-2xl rounded-[2rem] shadow-xl shadow-orange-100 disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            <CheckCircle2 className="w-8 h-8 mr-4 stroke-[3]" />
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
                  className="h-20 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-orange-100 active:scale-[0.98] transition-all"
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

      {/* Exit Confirmation Overlay */}
      <AnimatePresence>
        {exitRequested && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-white flex items-center justify-center p-10"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full flex flex-col gap-10 text-center"
            >
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-red-500 stroke-[2.5]" />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em]">Unsaved Changes</h4>
                <p className="text-4xl font-black text-zinc-900 leading-tight">
                  Do you really want to close it because there are changes made?
                </p>
                <p className="text-lg text-zinc-400 font-medium">
                  All items in the partial bill will be moved back to the main order.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={onConfirmExit}
                  className="h-24 bg-red-500 hover:bg-red-600 text-white rounded-3xl font-black text-2xl shadow-xl shadow-red-100 active:scale-[0.98] transition-all"
                >
                  YES, CLOSE SPLIT
                </Button>
                <Button
                  variant="ghost"
                  onClick={onCancelExit}
                  className="h-20 text-zinc-400 hover:text-zinc-900 font-black text-xl uppercase tracking-widest"
                >
                  NO, STAY HERE
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
