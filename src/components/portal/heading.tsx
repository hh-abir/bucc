export default function Heading({
  headingText,
  subHeadingText,
}: {
  headingText: string;
  subHeadingText?: string;
}) {
  return (
    <div className="mb-8 border-b border-border pb-6">
      <h1 className="font-serif text-4xl tracking-tight text-foreground">{headingText}</h1>
      {subHeadingText ? <p className="mt-2 text-muted-foreground">{subHeadingText}</p> : null}
    </div>
  );
}
