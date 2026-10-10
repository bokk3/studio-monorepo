import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-neon-cyan text-black hover:bg-neon-cyan/90 shadow-[0_0_15px_rgba(0,243,255,0.4)]",
        cyan:
          "bg-neon-cyan/15 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.25)]",
        magenta:
          "bg-neon-magenta/15 border border-neon-magenta text-neon-magenta hover:bg-neon-magenta/30 shadow-[0_0_15px_rgba(255,0,255,0.25)]",
        cobalt:
          "bg-blue-600/20 border border-blue-500 text-blue-300 hover:bg-blue-600/35 shadow-[0_0_15px_rgba(0,85,255,0.3)]",
        outline:
          "border border-slate-700 bg-black/40 text-slate-200 hover:border-slate-500 hover:bg-slate-900/50",
        ghost:
          "text-slate-400 hover:text-white hover:bg-slate-800/50",
        glass:
          "backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/25 text-white shadow-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-8 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
