"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gray-950 text-white shadow-md shadow-gray-900/15 hover:bg-gray-800 hover:shadow-gray-900/25",
        destructive:
          "bg-red-600 text-white shadow-md shadow-red-500/20 hover:bg-red-500",
        outline:
          "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
        secondary:
          "bg-gray-100 text-gray-800 hover:bg-gray-200",
        ghost:
          "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
        link:
          "text-indigo-600 underline-offset-4 hover:underline hover:text-indigo-700",
        gradient:
          "bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/25 hover:opacity-90 hover:shadow-indigo-500/35",
        "gradient-gold":
          "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:opacity-90",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 rounded-lg px-3 text-xs",
        lg:      "h-12 rounded-xl px-8 text-base",
        xl:      "h-14 rounded-xl px-10 text-lg",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
