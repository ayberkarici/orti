export default function CalendarLoading() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white px-6 py-4 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="h-9 w-24 bg-slate-100 rounded-md animate-pulse" />
      </div>
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}


