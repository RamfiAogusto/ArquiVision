import React, { useState } from "react";
import { cn } from "../../lib/utils";

const TooltipProvider = ({ children }) => {
  return <>{children}</>;
};

const Tooltip = React.forwardRef(
  ({ className, children, open, onOpenChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(open || false);

    const handleOpenChange = (open) => {
      setIsOpen(open);
      onOpenChange?.(open);
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (child.type.displayName === "TooltipTrigger") {
            return React.cloneElement(child, {
              onClick: () => handleOpenChange(!isOpen),
            });
          }
          if (child.type.displayName === "TooltipContent") {
            return isOpen ? child : null;
          }
          return child;
        })}
      </div>
    );
  }
);
Tooltip.displayName = "Tooltip";

const TooltipTrigger = React.forwardRef(
  ({ className, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.cloneElement(children, { ref, ...props }) : (
      <button
        type="button"
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
    
    return Comp;
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(
  ({ className, children, side = "top", ...props }, ref) => {
    const positions = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-2 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          positions[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }; 