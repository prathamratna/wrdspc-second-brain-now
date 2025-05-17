import * as React from "react";

export const Popover = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => <button ref={ref} {...props} />
);
export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
);
PopoverTrigger.displayName = "PopoverTrigger";
PopoverContent.displayName = "PopoverContent"; 