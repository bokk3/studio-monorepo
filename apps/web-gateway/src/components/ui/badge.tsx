import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800",
        cyan:
          "border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.15)]",
        magenta:
          "border-neon-magenta/40 bg-neon-magenta/15 text-neon-magenta shadow-[0_0_10px_rgba(255,0,255,0.15)]",
        cobalt:
          "border-blue-500/40 bg-blue-500/20 text-blue-300 shadow-[0_0_10px_rgba(0,85,255,0.2)]",
        secondary:
          "border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700",
        destructive:
          "border-transparent bg-red-900/60 text-red-200 border-red-500/40",
        outline:
          "border-slate-700 text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
