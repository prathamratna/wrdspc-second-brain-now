
import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    // Base styles
    let variantClasses = "";
    let sizeClasses = "";
    
    // Variant styles
    switch (variant) {
      case "default":
        variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
        break;
      case "ghost":
        variantClasses = "hover:bg-accent hover:text-accent-foreground";
        break;
      case "outline":
        variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
        break;
      case "secondary":
        variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        break;
      case "destructive":
        variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90";
        break;
      case "link":
        variantClasses = "text-primary underline-offset-4 hover:underline";
        break;
    }
    
    // Size styles
    switch (size) {
      case "default":
        sizeClasses = "h-10 px-4 py-2";
        break;
      case "sm":
        sizeClasses = "h-9 px-3 text-sm";
        break;
      case "lg":
        sizeClasses = "h-11 px-8 text-base";
        break;
      case "icon":
        sizeClasses = "h-10 w-10 p-0";
        break;
    }
    
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
