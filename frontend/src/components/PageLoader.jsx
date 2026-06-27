import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink px-4">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-black/10 bg-white px-8 py-12 text-center shadow-soft">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
        <p className="text-lg font-semibold">Loading content...</p>
        <p className="text-sm text-sand">Hang tight while the page loads.</p>
      </div>
    </div>
  );
};

export default PageLoader;
