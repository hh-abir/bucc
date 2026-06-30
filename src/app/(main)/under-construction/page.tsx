export default function UnderConstruction() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center text-center px-4 space-y-6">
      <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Under Construction</h1>
      <p className="text-muted-foreground max-w-md">
        We are currently working on this page. Please check back later!
      </p>
      <a 
        href="/" 
        className="inline-flex items-center justify-center px-6 py-3 border border-border bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
      >
        Return Home
      </a>
    </div>
  );
}
