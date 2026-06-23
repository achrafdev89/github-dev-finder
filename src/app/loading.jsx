export default function Loading() {
    return (<div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10"/>
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand"/>
        </div>
        <p className="font-mono text-sm text-zinc-500">loading…</p>
      </div>
    </div>);
}
