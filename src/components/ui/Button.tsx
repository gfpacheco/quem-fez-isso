import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "ink" | "accent" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonVariantOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonProps = ComponentProps<"button"> & ButtonVariantOptions;

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center gap-3 uppercase transition-[transform,box-shadow,background-color,color] duration-100 disabled:pointer-events-none disabled:opacity-50";

const pressable = "hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5";

const variantClasses: Record<ButtonVariant, string> = {
  ink: cn(
    pressable,
    "bg-ink font-display tracking-[0.06em] text-paper shadow-hard-accent hover:shadow-hard-accent-lg active:shadow-[2px_2px_0_var(--color-accent)]",
  ),
  accent: cn(
    pressable,
    "bg-accent font-display tracking-[0.08em] text-paper shadow-hard-lg hover:shadow-[6px_6px_0_var(--color-ink)] active:shadow-[2px_2px_0_var(--color-ink)]",
  ),
  outline: "border-2 border-ink bg-transparent font-label font-semibold tracking-[0.2em] text-ink hover:bg-ink hover:text-paper",
  ghost: "font-label font-medium tracking-[0.2em] text-mute underline-offset-4 hover:text-ink hover:underline",
};

const sizeClasses: Record<ButtonVariant, Record<ButtonSize, string>> = {
  ink: { md: "px-4 pt-3 pb-2.5 text-xl", lg: "px-4 pt-5 pb-4 text-[28px]" },
  accent: { md: "px-4 pt-3 pb-2.5 text-xl", lg: "px-4 pt-4 pb-3 text-2xl" },
  outline: { md: "px-3 py-2 text-[11px]", lg: "px-4 py-3 text-xs" },
  ghost: { md: "px-2 py-2 text-[11px]", lg: "px-2 py-3 text-xs" },
};

export function Button({ variant = "ink", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonVariants({ variant, size, className })} {...props} />;
}

export function buttonVariants({ variant = "ink", size = "md", className }: ButtonVariantOptions) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[variant][size], className);
}
