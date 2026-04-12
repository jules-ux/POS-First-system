import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge, Tag, Percent, DollarSign, XCircle, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CouponViewProps {
  pendingValue: string;
  discounts: { type: 'percentage' | 'fixed', value: number, label: string }[];
  onRemoveDiscount: (index: number) => void;
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
  discounts,
  onRemoveDiscount,
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
      {/* Left Column: Custom Discount & Applied Discounts */}
      <div className="flex-1 flex flex-col border-r border-zinc-200 bg-white">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center shrink-0">
          <h3 className="text-base font-black text-zinc-400 uppercase tracking-widest">Discounts</h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400 hover:text-red-500 font-black uppercase tracking-widest text-sm">
            <XCircle className="w-6 h-6 mr-2 stroke-[2.5]" />
            Close
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Custom Discount Section (Fixed) */}
          <div className="p-6 space-y-4 shrink-0 border-b border-zinc-50">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Custom Discount</label>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => setDiscountType('percentage')}
                className={`h-16 rounded-xl border-2 font-black text-sm gap-3 transition-all ${discountType === 'percentage' ? 'border-zinc-700 bg-zinc-700 text-white' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
              >
                <Percent className="w-5 h-5 stroke-[3]" />
                PERCENT
              </Button>
              <Button 
                variant="outline"
                onClick={() => setDiscountType('fixed')}
                className={`h-16 rounded-xl border-2 font-black text-sm gap-3 transition-all ${discountType === 'fixed' ? 'border-zinc-700 bg-zinc-700 text-white' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
              >
                <DollarSign className="w-5 h-5 stroke-[3]" />
                FIXED
              </Button>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1 text-center bg-white rounded-xl py-3 border border-zinc-100 shadow-sm">
                <span className="text-3xl font-black text-zinc-900 tabular-nums">
                  {discountType === 'fixed' && "$"}
                  {pendingValue || "0"}
                  {discountType === 'percentage' && "%"}
                </span>
              </div>

              <Button
                className="h-16 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-lg shadow-lg shadow-orange-100 active:scale-[0.98] transition-all shrink-0"
                onClick={handleApplyCustom}
              >
                APPLY
              </Button>
            </div>
          </div>

          {/* Applied Discounts Section (Independent Scroll) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-zinc-50/30">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Applied Coupons</label>
            {discounts.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-zinc-100 rounded-2xl bg-white">
                <p className="text-zinc-300 font-bold">No coupons applied</p>
              </div>
            ) : (
              <div className="space-y-2">
                {discounts.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100 group shadow-sm">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-orange-500 stroke-[2.5]" />
                      <span className="font-black text-orange-900 uppercase tracking-tight">{d.label}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRemoveDiscount(i)}
                      className="w-8 h-8 text-orange-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                    >
                      <XCircle className="w-5 h-5 stroke-[2.5]" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Active Promotions (Compact & Full Width) */}
      <div className="flex-1 flex flex-col bg-zinc-50/50 min-w-0">
        <div className="p-6 border-b border-zinc-200 bg-white shrink-0">
          <h3 className="text-base font-black text-zinc-400 uppercase tracking-widest">Promotions</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-2">
            {ACTIVE_PROMOS.map((promo) => (
              <button
                key={promo.id}
                onClick={() => onApplyDiscount(promo.type as any, promo.value, promo.label)}
                className="w-full p-4 rounded-xl border-2 border-zinc-100 bg-white hover:border-orange-500 flex justify-between items-center group transition-all text-left shadow-sm"
              >
                <span className="text-lg font-black text-zinc-900 tracking-tight uppercase">{promo.label}</span>
                <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <Plus className="w-5 h-5 text-zinc-300 group-hover:text-white stroke-[3]" />
                </div>
              </button>
            ))}
          </div>
        </div>
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
