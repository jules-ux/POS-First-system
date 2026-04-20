import { motion } from "motion/react";
import { X, Plus, Minus, Check } from "lucide-react";
import { CartItem } from "@/src/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditItemViewProps {
  item: CartItem;
  onSave: (cartItemId: string, modifications: string[]) => void;
  onClose: () => void;
  exitRequested?: boolean;
  onConfirmExit?: () => void;
  onCancelExit?: () => void;
}

export function EditItemView({ 
  item, 
  onSave, 
  onClose,
  exitRequested,
  onConfirmExit,
  onCancelExit
}: EditItemViewProps) {
  const mods = item.modifications || [];

  const updateMods = (newMods: string[]) => {
    onSave(item.cartItemId, newMods);
  };

  const toggleIngredient = (ingredient: string) => {
    const noMod = `NO ${ingredient.toUpperCase()}`;
    if (mods.includes(noMod)) {
      updateMods(mods.filter(m => m !== noMod));
    } else {
      updateMods([...mods, noMod]);
    }
  };

  const addExtra = (ingredient: string) => {
    const extraMod = `EXTRA ${ingredient.toUpperCase()}`;
    if (mods.includes(extraMod)) {
      updateMods(mods.filter(m => m !== extraMod));
    } else {
      updateMods([...mods, extraMod]);
    }
  };

  const removeMod = (mod: string) => {
    updateMods(mods.filter(m => m !== mod));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.1 }}
      className="absolute inset-0 z-50 bg-white flex flex-col overflow-hidden"
    >
      <header className="h-[7.5vh] border-b border-zinc-200 flex items-center justify-between px-[3vh] bg-white shrink-0">
        <div className="flex flex-col">
          <h2 className="text-[1.8vh] font-black text-zinc-900 tracking-tight uppercase leading-none">Edit {item.name}</h2>
          <p className="text-[0.9vh] font-bold text-zinc-400 uppercase tracking-widest mt-[0.4vh]">Instant modifications</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="w-[4vh] h-[4vh] rounded-full hover:bg-zinc-100">
          <X className="w-[2vh] h-[2vh] text-zinc-400 stroke-[3]" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-[3vh] custom-scrollbar">
        <div className="grid grid-cols-2 gap-[4vh]">
          {/* Ingredients Section */}
          <div className="space-y-[2vh]">
            <h3 className="text-[1vh] font-black text-zinc-400 uppercase tracking-[0.2em]">Ingredients</h3>
            <div className="grid grid-cols-1 gap-[0.5vh]">
              {item.ingredients?.map((ing) => {
                const isNo = mods.includes(`NO ${ing.toUpperCase()}`);
                const isExtra = mods.includes(`EXTRA ${ing.toUpperCase()}`);
                
                return (
                  <div key={ing} className="flex items-center gap-[0.5vh]">
                    <button
                      onClick={() => toggleIngredient(ing)}
                      className={`flex-1 h-[5vh] px-[2vh] flex items-center justify-between border transition-all rounded-none font-black text-[1.1vh] uppercase tracking-widest ${
                        isNo 
                          ? "bg-red-50 border-red-200 text-red-600" 
                          : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      <span>{ing}</span>
                      {isNo && <Minus className="w-[1.5vh] h-[1.5vh] stroke-[3]" />}
                    </button>
                    <button
                      onClick={() => addExtra(ing)}
                      className={`w-[5vh] h-[5vh] flex items-center justify-center border transition-all rounded-none font-black text-[1.1vh] ${
                        isExtra 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                          : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300"
                      }`}
                    >
                      <Plus className="w-[1.5vh] h-[1.5vh] stroke-[3]" />
                    </button>
                  </div>
                );
              })}
              {!item.ingredients && (
                <p className="text-zinc-300 italic text-[1.2vh]">No standard ingredients listed.</p>
              )}
            </div>
          </div>

          {/* Modifications Section */}
          <div className="space-y-[2vh]">
            <h3 className="text-[1vh] font-black text-zinc-400 uppercase tracking-[0.2em]">Active Changes</h3>
            <div className="min-h-[15vh] border border-dashed border-zinc-100 p-[1vh] space-y-[0.5vh] bg-zinc-50/30">
              {mods.length === 0 ? (
                <div className="h-full flex items-center justify-center py-[4vh]">
                  <p className="text-zinc-300 text-[0.9vh] font-bold uppercase tracking-widest">No modifications</p>
                </div>
              ) : (
                mods.map((mod, i) => (
                  <div key={i} className="flex justify-between items-center p-[1vh] bg-white border border-zinc-200 group">
                    <span className="text-[1vh] font-black text-zinc-900 tracking-widest">{mod}</span>
                    <button onClick={() => removeMod(mod)} className="text-zinc-300 hover:text-red-500">
                      <X className="w-[1.2vh] h-[1.2vh] stroke-[3]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {exitRequested && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-[4vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-[4vh] rounded-none border-4 border-zinc-900 max-w-[50vh] w-full shadow-[1vh_1vh_0px_0px_rgba(0,0,0,1)]"
          >
            <h3 className="text-[2vh] font-black text-zinc-900 uppercase tracking-tight mb-[1vh]">Close Edit View?</h3>
            <p className="text-[1.2vh] font-bold text-zinc-500 uppercase tracking-widest mb-[4vh]">Do you want to close this?</p>
            <div className="grid grid-cols-2 gap-[2vh]">
              <Button 
                variant="outline" 
                onClick={onCancelExit}
                className="h-[6vh] rounded-none border-2 border-zinc-200 font-black uppercase tracking-widest text-[1.1vh]"
              >
                No, Stay
              </Button>
              <Button 
                onClick={onConfirmExit}
                className="h-[6vh] rounded-none bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[1.1vh]"
              >
                Yes, Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
);
}
