import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CATEGORIES } from "@/lib/events-data";
import { cn } from "@/lib/utils";

interface EventCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventCategoryModal({ open, onOpenChange }: EventCategoryModalProps) {
  const navigate = useNavigate();

  const handleSelect = (categoryId: string) => {
    onOpenChange(false);
    navigate(`/explore/${categoryId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card text-foreground max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            What event are you looking a companion for?
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a category to explore people going to similar events
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-border bg-secondary/30 py-6",
                "hover:border-primary hover:bg-primary/10 hover:text-primary transition-all",
              )}
            >
              <span className="text-3xl" aria-hidden>
                {cat.icon}
              </span>
              <span className="text-sm font-medium text-white">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
