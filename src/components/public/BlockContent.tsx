import Link from "next/link";

type InlineContent =
  | string
  | {
      type?: string;
      text?: string;
      href?: string;
      content?: InlineContent[];
      styles?: Record<string, boolean>;
    };

type Block = {
  id?: string;
  type?: string;
  props?: Record<string, any>;
  content?: InlineContent[] | string;
  children?: Block[];
};

function renderInline(content: InlineContent[] | string | undefined) {
  if (!content) return null;
  if (typeof content === "string") return content;

  return content.map((item, index) => {
    if (typeof item === "string") {
      return <span key={index}>{item}</span>;
    }

    if (item.type === "link" && item.href) {
      return (
        <Link
          key={index}
          href={item.href}
          className="underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
        >
          {renderInline(item.content)}
        </Link>
      );
    }

    let node: React.ReactNode = item.text ?? renderInline(item.content);
    const styles = item.styles ?? {};

    if (styles.code) {
      node = (
        <code className="rounded bg-muted px-1.5 py-0.5 font-sans text-sm">
          {node}
        </code>
      );
    }
    if (styles.bold) node = <strong>{node}</strong>;
    if (styles.italic) node = <em>{node}</em>;
    if (styles.underline) node = <span className="underline underline-offset-4">{node}</span>;

    return <span key={index}>{node}</span>;
  });
}

function renderBlock(block: Block, index: number) {
  const key = block.id ?? index;
  const level = Number(block.props?.level ?? 2);

  switch (block.type) {
    case "heading":
      if (level === 1) {
        return (
          <h2 key={key} className="mt-12 font-serif text-3xl font-bold tracking-tight">
            {renderInline(block.content)}
          </h2>
        );
      }

      if (level === 3) {
        return (
          <h4 key={key} className="mt-8 font-serif text-xl font-bold">
            {renderInline(block.content)}
          </h4>
        );
      }

      return (
        <h3 key={key} className="mt-10 font-serif text-2xl font-bold tracking-tight">
          {renderInline(block.content)}
        </h3>
      );

    case "bulletListItem":
      return (
        <ul key={key} className="my-3 list-disc pl-6">
          <li>{renderInline(block.content)}</li>
        </ul>
      );

    case "numberedListItem":
      return (
        <ol key={key} className="my-3 list-decimal pl-6">
          <li>{renderInline(block.content)}</li>
        </ol>
      );

    case "checkListItem":
      return (
        <p key={key} className="my-3 flex gap-3">
          <span aria-hidden="true">{block.props?.checked ? "[x]" : "[ ]"}</span>
          <span>{renderInline(block.content)}</span>
        </p>
      );

    case "quote":
      return (
        <blockquote key={key} className="my-6 border-l-2 border-foreground pl-5 text-muted-foreground">
          {renderInline(block.content)}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre key={key} className="my-6 overflow-x-auto rounded-md bg-muted p-4 font-sans text-sm">
          <code>{renderInline(block.content)}</code>
        </pre>
      );

    case "image": {
      const url = block.props?.url;
      if (!url) return null;

      return (
        <figure key={key} className="my-10">
          <img
            src={url}
            alt={block.props?.caption || "Blog image"}
            className="aspect-video w-full rounded-md border border-border object-cover"
          />
          {block.props?.caption ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.props.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    case "paragraph":
    default:
      return (
        <p key={key} className="my-5 leading-8 text-muted-foreground">
          {renderInline(block.content)}
        </p>
      );
  }
}

export default function BlockContent({ content }: { content: unknown }) {
  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  return <div>{(content as Block[]).map(renderBlock)}</div>;
}
