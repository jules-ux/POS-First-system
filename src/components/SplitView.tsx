import { CartItem } from "@/src/types";
import { Button } from "@/components/ui/button";
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
    <div className="flex-1 flex bg-zinc-50 overflow-hidden relative w-full h-full">
      {/* Left Column: Main Order */}
      <div className="flex-1 flex flex-col border-r border-zinc-200 bg-white min-w-[300px]">
        <div className="h-[8vh] px-4 border-b border-zinc-100 flex justify-between items-center shrink-0">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Main Order</h3>
          <span className="text-[10px] font-bold text-zinc-400">{mainCart.length} items</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {mainCart.map((item) => (
            <button
              key={item.cartItemId}
              onClick={() => handleItemClick(item, 'toSplit')}
              className="w-full p-3 rounded-lg border border-zinc-100 bg-white hover:border-zinc-900 shadow-sm flex justify-between items-center group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-black text-zinc-900 tabular-nums">{item.quantity}x</span>
                <span className="text-[12px] font-black tracking-tight text-zinc-900">{item.name.toUpperCase()}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-200 group-hover:text-zinc-900 stroke-[2.5]" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Split Order */}
      <div className="flex-1 flex flex-col bg-zinc-50">
        <div className="h-[8vh] px-4 border-b border-zinc-200 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Partial Bill</h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400 hover:text-red-500 font-black uppercase tracking-widest text-[10px]">
            <XCircle className="w-4 h-4 mr-1 stroke-[2.5]" />
            Cancel
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden p-2 flex flex-col">
          {splitCart.length === 0 ? (
            <div className="flex-1 w-full flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-200 rounded-xl">
              <ArrowRight className="w-8 h-8 text-zinc-200 mb-2" />
              <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">Transfer items here</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto custom-scrollbar space-y-1">
              {splitCart.map((item) => (
                <button
                  key={item.cartItemId}
                  onClick={() => handleItemClick(item, 'toMain')}
                  className="w-full p-3 rounded-lg border border-white bg-white hover:border-zinc-900 shadow-sm flex justify-between items-center group transition-all"
                >
                  <ArrowLeft className="w-4 h-4 text-zinc-200 group-hover:text-zinc-900 stroke-[2.5]" />
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-[12px] font-black tracking-tight text-zinc-900">{item.name.toUpperCase()}</span>
                    <span className="text-[14px] font-black text-orange-500 tabular-nums">{item.quantity}x</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-white border-t border-zinc-200 flex flex-col gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] shrink-0">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Partial Total</span>
              <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">Including 8% Tax</span>
            </div>
            <span className="text-[24px] font-black text-orange-500 tabular-nums tracking-tighter">${splitTotal.toFixed(2)}</span>
          </div>
          <Button 
            disabled={splitCart.length === 0}
            onClick={onPaySplit}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-black text-[14px] rounded-xl shadow-xl shadow-orange-100 disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            <CheckCircle2 className="w-5 h-5 mr-2 stroke-[3]" />
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
            className="absolute inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-[16rem] w-full shadow-2xl flex flex-col gap-4"
            >
              <div className="text-center">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Split Quantity</h4>
                <p className="text-[14px] font-black text-zinc-900 tracking-tight">How many {pendingMove.item.name}?</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Available: {pendingMove.item.quantity}</p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-3 flex items-center justify-center">
                <span className="text-[24px] font-black text-zinc-900 tabular-nums">{moveQty || "0"}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    className="h-8 text-[12px] font-black rounded-lg border-zinc-100 hover:border-zinc-900"
                    onClick={() => {
                      if (val === "C") setMoveQty("");
                      else setMoveQty(prev => prev + val);
                    }}
                  >
                    {val}
                  </Button>
                ))}
                <Button
                  className="h-8 col-span-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-black text-[12px] shadow-lg shadow-orange-100 active:scale-[0.98] transition-all"
                  onClick={confirmMove}
                >
                  OK
                </Button>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setPendingMove(null)}
                className="text-[10px] text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest h-8"
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
            className="absolute inset-0 z-[60] bg-white flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-sm w-full flex flex-col gap-6 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-red-500 stroke-[2.5]" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Unsaved Changes</h4>
                <p className="text-[20px] font-black text-zinc-900 leading-tight">
                  Close partial bill?
                </p>
                <p className="text-[12px] text-zinc-400 font-medium">
                  All items in the partial bill will be moved back to the main order.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={onConfirmExit}
                  className="h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-[14px] shadow-xl shadow-red-100 active:scale-[0.98] transition-all"
                >
                  YES, CLOSE SPLIT
                </Button>
                <Button
                  variant="ghost"
                  onClick={onCancelExit}
                  className="h-10 text-zinc-400 hover:text-zinc-900 font-black text-[12px] uppercase tracking-widest"
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
