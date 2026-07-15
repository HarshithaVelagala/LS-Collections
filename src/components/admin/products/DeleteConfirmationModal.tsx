"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  loading: boolean;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, productName, loading }: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border border-rose-500/30 bg-black text-white p-6 rounded-none select-none">
        <DialogHeader className="border-b border-rose-500/10 pb-4">
          <DialogTitle className="font-serif text-rose-400 text-xl font-bold tracking-wider uppercase flex items-center gap-2">
            <AlertTriangle className="h-5.5 w-5.5 animate-pulse" /> Confirm Asset Deletion
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-xs text-zinc-300 font-light leading-relaxed">
            Are you sure you want to permanently delete the luxury asset:
          </p>
          <div className="bg-rose-950/10 border border-rose-500/10 p-3 text-center">
            <span className="font-serif text-sm font-bold text-white uppercase">{productName}</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium">
            This action is irreversible. All associated database records, media pointers, and stock levels will be deleted from the LS Collections catalog.
          </p>
        </div>

        <div className="flex gap-4 border-t border-rose-500/10 pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
            className="flex-1 border-zinc-800 text-zinc-400 hover:bg-zinc-900 rounded-none tracking-widest text-[10px] uppercase py-4.5 font-bold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold tracking-widest text-[10px] uppercase py-4.5 rounded-none shadow-lg shadow-rose-950/20 cursor-pointer"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" /> : "Delete Permanently"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
