import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary via-primary/80 to-primary/70 text-primary-foreground shadow-lg hover:brightness-110",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg",
        outline:
          "border-2 border-input bg-transparent text-foreground hover:bg-muted/10 hover:border-muted-foreground shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:scale-105 hover:bg-secondary/80",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground",
        link: "text-primary underline-offset-8 hover:underline hover:text-primary/90",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-lg",
        icon: "h-12 w-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
