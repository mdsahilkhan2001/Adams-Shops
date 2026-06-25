const LoadingSkeleton = () => {
  return (
    <div className="lux-container py-20">
      <div className="space-y-8">
        <div className="h-72 rounded-[2rem] bg-slate-200 animate-pulse"></div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-4 rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
              <div className="h-48 rounded-3xl bg-slate-200 animate-pulse"></div>
              <div className="h-6 w-3/4 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="h-5 w-1/2 rounded-full bg-slate-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
