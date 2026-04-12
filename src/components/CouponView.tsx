import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge, Tag, Percent, DollarSign, XCircle, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CouponViewProps {
  pendingValue: string;
  onApplyDiscount: (type: 'percentage' | 'fixed', value: number, label: string) => void;
  onCancel: () => void;
}

const ACTIVE_PROMOS = [
  { id: 'happy-hour', label: 'HAPPY HOUR - 20%', type: 'percentage', value: 20 },
  { id: 'lunch-deal', label: 'LUNCH DEAL - $5', type: 'fixed', value: 5 },
  { id: 'staff-disc', label: 'STAFF DISCOUNT - 50%', type: 'percentage', value: 50 },
  { id: 'promo-10', label: 'PROMO CODE 10%', type: 'percentage', value: 10 },
  { id: 'early-bird', label: 'EARLY BIRD - 15%', type: 'percentage', value: 15 },
  { id: 'weekend-spec', label: 'WEEKEND SPECIAL - $10', type: 'fixed', value: 10 },
];

export function CouponView({ pendingValue, onApplyDiscount, onCancel }: CouponViewProps) {
  const [couponCode, setCouponCode] = useState("");
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
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Coupon & Custom</h3>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-zinc-400 hover:text-red-500 font-bold uppercase tracking-widest text-xs">
            <XCircle className="w-5 h-5 mr-2" />
            Close
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-10">
            {/* Coupon Code Input */}
            <div className="space-y-4">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Enter Coupon Code</label>
              <div className="flex gap-3">
                <div className="flex-1 bg-zinc-50 rounded-2xl border border-zinc-100 p-4 flex items-center gap-4 focus-within:border-zinc-900 transition-all">
                  <Tag className="w-6 h-6 text-zinc-300" />
                  <input 
                    type="text" 
                    placeholder="E.G. SUMMER24"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-transparent border-none outline-none w-full font-black text-xl placeholder:text-zinc-200"
                  />
                </div>
                <Button className="h-16 px-8 bg-zinc-900 text-white font-black rounded-2xl">APPLY</Button>
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Custom Discount */}
            <div className="space-y-6">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Custom Discount</label>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setDiscountType('percentage')}
                  className={`h-20 rounded-2xl border-2 font-black text-lg gap-3 transition-all ${discountType === 'percentage' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-100 text-zinc-400'}`}
                >
                  <Percent className="w-6 h-6" />
                  PERCENTAGE
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setDiscountType('fixed')}
                  className={`h-20 rounded-2xl border-2 font-black text-lg gap-3 transition-all ${discountType === 'fixed' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-100 text-zinc-400'}`}
                >
                  <DollarSign className="w-6 h-6" />
                  FIXED PRICE
                </Button>
              </div>

              <div className="bg-zinc-50 rounded-[2rem] p-6 flex items-center gap-6">
                <div className="flex-1 text-center bg-white rounded-xl py-4 border border-zinc-100">
                  <span className="text-5xl font-black text-zinc-900 tabular-nums">
                    {discountType === 'fixed' && "$"}
                    {pendingValue || "0"}
                    {discountType === 'percentage' && "%"}
                  </span>
                </div>

                <Button
                  className="h-20 px-10 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-lg shadow-lg active:scale-[0.98] transition-all shrink-0"
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
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Active Promotions</h3>
        </div>
        <ScrollArea className="flex-1 min-h-0" viewportClassName="snap-y snap-mandatory">
          <div className="p-6 space-y-3">
            {ACTIVE_PROMOS.map((promo) => (
              <button
                key={promo.id}
                onClick={() => onApplyDiscount(promo.type as any, promo.value, promo.label)}
                className="w-full p-6 rounded-3xl border-2 border-zinc-100 bg-white hover:border-zinc-900 flex justify-between items-center group transition-all text-left snap-start"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Promotion</span>
                  <span className="text-xl font-black text-zinc-900 tracking-tight">{promo.label}</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <Plus className="w-6 h-6 text-zinc-300 group-hover:text-white" />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
