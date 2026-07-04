export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-paper">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-green-950/20 border-t-brand-green-950 rounded-full animate-spin"></div>
        <p className="text-brand-muted text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
