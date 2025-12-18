import { cn } from "@/lib/utils";

const Textarea = ({ className, error, ...props }) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-border/50 bg-background px-3.5 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          error && "border-destructive focus:ring-destructive focus:border-destructive",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default Textarea;