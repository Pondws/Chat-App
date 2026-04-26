import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Input({
  className,
  leftIcon,
  rightIcon,
  type,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leftIcon}
        </div>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-8 w-full rounded-sm border border-input bg-transparent py-1 text-base outline-none transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

          // dynamic padding
          leftIcon ? "pl-10" : "px-2.5",
          rightIcon ? "pr-10" : "",

          className
        )}
        {...props}
      />

      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {rightIcon}
        </div>
      )}
    </div>
  )
}

export { Input }
