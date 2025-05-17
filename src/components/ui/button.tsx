import * as React from "react"

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  )
)
Button.displayName = "Button"
