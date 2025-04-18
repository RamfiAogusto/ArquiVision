import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Dialog = React.forwardRef(
  ({ className, children, open = false, onOpenChange, ...props }, ref) => {
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onOpenChange && onOpenChange(false);
      }
    };

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          className
        )}
        onClick={handleBackdropClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Dialog.displayName = "Dialog";

const DialogTrigger = React.forwardRef(({ className, children, onClick, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.cloneElement(children, { ref, ...props }) : (
    <button
      type="button"
      ref={ref}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
  
  return Comp;
});
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative max-w-lg max-h-[80vh] overflow-auto rounded-lg bg-white p-6 shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogClose = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </button>
    );
  }
);
DialogClose.displayName = "DialogClose";

export { Dialog, DialogTrigger, DialogContent, DialogClose }; 