export function Shimmer({ className = "" }) {
    return (<div className={`relative overflow-hidden rounded-md bg-white/[0.04] ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"/>
    </div>);
}
export function DeveloperCardSkeleton() {
    return (<div className="glass p-5">
      <div className="flex items-center gap-4">
        <Shimmer className="h-14 w-14 rounded-full"/>
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-2/3"/>
          <Shimmer className="h-3 w-1/3"/>
        </div>
      </div>
      <Shimmer className="mt-4 h-3 w-full"/>
      <Shimmer className="mt-2 h-3 w-4/5"/>
      <div className="mt-4 flex gap-3">
        <Shimmer className="h-8 w-20 rounded-lg"/>
        <Shimmer className="h-8 w-20 rounded-lg"/>
      </div>
    </div>);
}
export function RepoCardSkeleton() {
    return (<div className="glass p-5 space-y-3">
      <Shimmer className="h-4 w-1/2"/>
      <Shimmer className="h-3 w-full"/>
      <Shimmer className="h-3 w-3/4"/>
      <div className="flex gap-3 pt-2">
        <Shimmer className="h-3 w-12"/>
        <Shimmer className="h-3 w-12"/>
        <Shimmer className="h-3 w-16"/>
      </div>
    </div>);
}
export function ProfileSkeleton() {
    return (<div className="space-y-6">
      <div className="glass p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Shimmer className="h-28 w-28 rounded-full"/>
        <div className="flex-1 w-full space-y-3">
          <Shimmer className="h-6 w-48"/>
          <Shimmer className="h-4 w-32"/>
          <Shimmer className="h-4 w-full max-w-md"/>
          <div className="flex gap-4 pt-2">
            <Shimmer className="h-12 w-24 rounded-xl"/>
            <Shimmer className="h-12 w-24 rounded-xl"/>
            <Shimmer className="h-12 w-24 rounded-xl"/>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (<RepoCardSkeleton key={i}/>))}
      </div>
    </div>);
}
