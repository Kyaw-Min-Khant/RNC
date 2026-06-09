/**
 * Merge class names (for Tailwind/NativeWind).
 * Use with clsx or classnames for conditional classes.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ").trim();
}
