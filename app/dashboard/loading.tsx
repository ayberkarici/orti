export default function DashboardLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="h-6 w-40 bg-slate-200 rounded-md animate-pulse mx-auto" />
        <div className="h-4 w-64 bg-slate-100 rounded-md animate-pulse mx-auto" />
      </div>
    </div>
  );
}


