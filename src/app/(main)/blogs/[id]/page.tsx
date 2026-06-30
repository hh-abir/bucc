import BlockContent from "@/components/public/BlockContent";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const revalidate = 7200; // Revalidate every 2 hours

const formatDate = (date?: Date) =>
  date
    ? new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "Unscheduled";

async function getBlogData(id: string) {
  await dbConnect();
  
  // Fetch main blog
  const blog = await Blog.findOne({ _id: id, status: "published" }).lean();
  if (!blog) return { blog: null, otherBlogs: [] };

  // Fetch 5 other recent blogs
  const otherBlogs = await Blog.find({ _id: { $ne: id }, status: "published" })
    .sort({ createdDate: -1 })
    .limit(5)
    .select("title _id createdDate")
    .lean();

  return {
    blog: { ...blog, _id: (blog as any)._id.toString() } as any,
    otherBlogs: otherBlogs.map((b: any) => ({ ...b, _id: b._id.toString() })),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { blog } = await getBlogData(id);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.description || "Read this article on the BUCC Portal.",
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      publishedTime: blog.createdDate,
      authors: [blog.author?.authorName || "BUCC Member"],
      images: [
        {
          url: blog.featuredImage || "/images/cover.jpeg",
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.featuredImage || "/images/cover.jpeg"],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { blog, otherBlogs } = await getBlogData(id);

  if (!blog) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background pb-32">
      {/* Cover Image Header */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-muted">
        <img
          src={blog.featuredImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-8 left-8 z-10">
          <Link href="/blogs">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <ArrowLeft size={14} /> Back to Blogs
            </button>
          </Link>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Title & Body */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-primary">
                {blog.category || "Blog"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1] text-foreground">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border/50 text-xs text-muted-foreground font-light">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  <span>
                    By <span className="font-medium text-foreground">{blog.author?.authorName || "BUCC Member"}</span>
                    {blog.author?.authorDesignation ? `, ${blog.author.authorDesignation}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span>{formatDate(blog.createdDate)}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-primary">
              <BlockContent content={blog.content} />
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-12">
              
              {/* Short Description Card */}
              <div className="bg-card border border-border rounded-xl p-8 space-y-4 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">In Summary</h3>
                <p className="text-sm font-light leading-relaxed text-foreground/80 italic">
                  "{blog.description}"
                </p>
              </div>

              {/* Related/Random Blogs */}
              {otherBlogs.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-serif border-b border-border pb-2 flex items-center justify-between">
                    Read Next
                  </h3>
                  <div className="space-y-4 flex flex-col">
                    {otherBlogs.map((otherBlog: any) => (
                      <Link 
                        key={otherBlog._id} 
                        href={`/blogs/${otherBlog._id}`}
                        className="group block space-y-2 p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                      >
                        <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {otherBlog.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={10} /> {formatDate(otherBlog.createdDate)}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <Link href="/blogs" className="block pt-4">
                     <button className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-3 border border-border rounded-md hover:bg-muted">
                       View All Articles <ArrowRight size={14} />
                     </button>
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>
    </article>
  );
}
