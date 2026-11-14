import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-[transform,background-color,border-color,color,box-shadow] duration-200 outline-none select-none focus-visible:ring-[3px] focus-visible:ring-primary-500/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700",
        accent:
          "bg-accent-500 text-white shadow-sm hover:bg-accent-600 active:bg-accent-700",
        secondary:
          "border-line-strong bg-surface text-ink hover:border-line-strong hover:bg-subtle",
        "outline-dark":
          "border-dark-outline bg-surface text-ink hover:bg-subtle",
        outline:
          "border-line-strong bg-transparent text-ink hover:bg-subtle",
        ghost: "text-ink-muted hover:bg-subtle hover:text-ink",
        link: "text-primary-600 underline-offset-4 hover:underline",
        destructive:
          "bg-error-bg text-status-cancelled hover:bg-error-bg/70",
        "dark-ghost": "text-dark-muted hover:bg-white/10 hover:text-dark-text",
      },
      size: {
        default: "h-[42px] px-4 text-sm",
        sm: "h-8 rounded-md px-3 text-[13px]",
        xs: "h-7 rounded-sm px-2 text-xs",
        lg: "h-[52px] rounded-md px-6 text-sm",
        pill: "h-10 rounded-full px-5 text-sm",
        "pill-lg": "h-[52px] rounded-full px-6 text-sm",
        icon: "size-[42px] rounded-md p-0",
        "icon-sm": "size-8 rounded-md p-0",
        "icon-lg": "size-[52px] rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
