import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge, Tag, Percent, DollarSign, XCircle, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CouponViewProps {
  pendingValue: string;
  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  exitRequested?: boolean;
  onApplyDiscount: (type: 'percentage' | 'fixed', value: number, label: string) => void;
  onCancel: () => void;
  onConfirmExit?: () => void;
  onCancelExit?: () => void;
}

const ACTIVE_PROMOS = [
  { id: 'happy-hour', label: 'HAPPY HOUR - 20%', type: 'percentage', value: 20 },
  { id: 'lunch-deal', label: 'LUNCH DEAL - $5', type: 'fixed', value: 5 },
  { id: 'staff-disc', label: 'STAFF DISCOUNT - 50%', type: 'percentage', value: 50 },
  { id: 'promo-10', label: 'PROMO CODE 10%', type: 'percentage', value: 10 },
  { id: 'early-bird', label: 'EARLY BIRD - 15%', type: 'percentage', value: 15 },
  { id: 'weekend-spec', label: 'WEEKEND SPECIAL - $10', type: 'fixed', value: 10 },
];

export function CouponView({ 
  pendingValue, 
  couponCode,
  onCouponCodeChange,
  exitRequested = false,
  onApplyDiscount, 
  onCancel,
  onConfirmExit,
  onCancelExit
}: CouponViewProps) {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  const handleApplyCustom = () => {
    const val = parseFloat(pendingValue);
    if (isNaN(val) || val <= 0) return;
    onApplyDiscount(discountType, val, `CUSTOM ${discountType === 'percentage' ? val + '%' : '$' + val}`);
  };

  return (
    <div className="flex-1 flex bg-zinc-50 overflow-hidden relative">
      {/* Left Column: Coupon Input & Custom Discount */}
      <div className="flex-1 flex flex-col border-r border-zinc-200 bg-white">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-base font-black text-zinc-400 uppercase tracking-widest">Coupon & Custom</h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400 hover:text-red-500 font-black uppercase tracking-widest text-sm">
            <XCircle className="w-6 h-6 mr-2 stroke-[2.5]" />
            Close
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-10">
            {/* Coupon Code Input */}
            <div className="space-y-4">
              <label className="text-sm font-black text-zinc-400 uppercase tracking-widest">Enter Coupon Code</label>
              <div className="flex gap-4">
                <div className="flex-1 bg-zinc-50 rounded-2xl border border-zinc-100 p-5 flex items-center gap-5 focus-within:border-zinc-900 transition-all">
                  <Tag className="w-8 h-8 text-zinc-300 stroke-[2.5]" />
                  <input 
                    type="text" 
                    placeholder="E.G. SUMMER24"
                    value={couponCode}
                    onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
                    className="bg-transparent border-none outline-none w-full font-black text-2xl placeholder:text-zinc-200"
                  />
                </div>
                <Button className="h-20 px-10 bg-zinc-900 text-white font-black rounded-2xl text-lg">APPLY</Button>
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Custom Discount */}
            <div className="space-y-6">
              <label className="text-sm font-black text-zinc-400 uppercase tracking-widest">Custom Discount</label>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setDiscountType('percentage')}
                  className={`h-24 rounded-2xl border-2 font-black text-xl gap-4 transition-all ${discountType === 'percentage' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-100 text-zinc-400'}`}
                >
                  <Percent className="w-8 h-8 stroke-[3]" />
                  PERCENTAGE
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setDiscountType('fixed')}
                  className={`h-24 rounded-2xl border-2 font-black text-xl gap-4 transition-all ${discountType === 'fixed' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-100 text-zinc-400'}`}
                >
                  <DollarSign className="w-8 h-8 stroke-[3]" />
                  FIXED PRICE
                </Button>
              </div>

              <div className="bg-zinc-50 rounded-[2rem] p-8 flex items-center gap-8">
                <div className="flex-1 text-center bg-white rounded-2xl py-6 border border-zinc-100 shadow-sm">
                  <span className="text-7xl font-black text-zinc-900 tabular-nums">
                    {discountType === 'fixed' && "$"}
                    {pendingValue || "0"}
                    {discountType === 'percentage' && "%"}
                  </span>
                </div>

                <Button
                  className="h-24 px-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-2xl shadow-xl active:scale-[0.98] transition-all shrink-0"
                  onClick={handleApplyCustom}
                >
                  APPLY
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Column: Active Promotions */}
      <div className="flex-1 flex flex-col bg-zinc-50/50 min-w-0">
        <div className="p-6 border-b border-zinc-200 bg-white">
          <h3 className="text-base font-black text-zinc-400 uppercase tracking-widest">Active Promotions</h3>
        </div>
        <ScrollArea className="flex-1 min-h-0" viewportClassName="snap-y snap-mandatory">
          <div className="p-6 space-y-4">
            {ACTIVE_PROMOS.map((promo) => (
              <button
                key={promo.id}
                onClick={() => onApplyDiscount(promo.type as any, promo.value, promo.label)}
                className="w-full p-8 rounded-[2rem] border-2 border-zinc-100 bg-white hover:border-zinc-900 flex justify-between items-center group transition-all text-left snap-start shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Promotion</span>
                  <span className="text-2xl font-black text-zinc-900 tracking-tight">{promo.label}</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <Plus className="w-8 h-8 text-zinc-300 group-hover:text-white stroke-[3]" />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
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
                  Your current coupon code or custom discount entry will be cleared.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={onConfirmExit}
                  className="h-24 bg-red-500 hover:bg-red-600 text-white rounded-3xl font-black text-2xl shadow-xl shadow-red-100 active:scale-[0.98] transition-all"
                >
                  YES, CLOSE COUPON
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
