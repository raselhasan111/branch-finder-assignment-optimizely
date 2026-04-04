export default function BranchListSkeleton() {
  return (
    <div
      className="grid gap-10"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col overflow-hidden rounded-[25px] bg-cream"
        >
          {/* Image placeholder */}
          <div
            className="h-[180px] w-full"
            style={{
              background: 'linear-gradient(135deg, #1a2942, #0d4d56)',
              opacity: 0.5,
            }}
          />

          {/* Content */}
          <div className="flex flex-1 flex-col p-10">
            <div className="mb-4 h-8 w-3/4 rounded-lg bg-warm-white" />
            <div className="mb-2 h-4 w-full rounded bg-warm-white" />
            <div className="mb-8 h-4 w-2/3 rounded bg-warm-white" />
            <div className="mb-4 h-4 w-1/2 rounded bg-warm-white" />
            <div className="mb-6 h-4 w-1/3 rounded bg-warm-white" />
            <div className="mt-auto h-12 w-full rounded-[50px] bg-warm-white" />
          </div>
        </div>
      ))}
    </div>
  );
}
