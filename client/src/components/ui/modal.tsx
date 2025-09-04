import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className = "" }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <DialogContent className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-trading-card rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-50 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
          data-testid="button-close-modal"
        >
          <X className="h-4 w-4" />
        </Button>
        {children}
      </DialogContent>
    </Dialog>
  );
}
