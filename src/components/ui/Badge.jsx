import { cn } from "@/lib/utils";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15",
    secondary: "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-border/60",
    success: "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
    warning: "bg-amber-500/10 text-amber-600 border border-amber-200",
    info: "bg-sky-500/10 text-sky-600 border border-sky-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;