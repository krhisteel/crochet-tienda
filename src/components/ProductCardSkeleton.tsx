export function ProductCardSkeleton() {
  return (
    <div className="liquid-card rounded-3xl overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-rose-100/50" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-20 bg-rose-100 rounded-full" />
          <div className="h-4 w-16 bg-rose-100 rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-rose-100 rounded-full mb-2" />
        <div className="h-4 w-full bg-rose-100 rounded-full mb-1" />
        <div className="h-4 w-2/3 bg-rose-100 rounded-full mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-rose-200/30">
          <div className="h-7 w-24 bg-rose-100 rounded-full" />
          <div className="h-10 w-24 bg-rose-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
