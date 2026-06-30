import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, PenTool } from "lucide-react";
import RefreshBlogsButton from "@/components/public/RefreshBlogsButton";

export const revalidate = 7200; // Revalidate every 2 hours

type BlogCard = {
  _id: string;
  title: string;
  description: string;
  featuredImage: string;
  category?: string;
  createdDate?: Date;
  author?: {
    authorName?: string;
    authorDesignation?: string;
    authorDepartment?: string;
  };
};

const formatDate = (date?: Date) =>
  date
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "Unscheduled";

async function getBlogs(authorId?: string) {
  await dbConnect();
  const query: any = { status: "published" };
  if (authorId) {
    query["author.authorId"] = authorId;
  }
  const blogs = await Blog.find(query)
    .sort({ createdDate: -1 })
    .lean();

  return blogs.map((blog: any) => ({
    ...blog,
    _id: blog._id.toString(),
  })) as BlogCard[];
}

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ author?: string }> }) {
  const { author } = await searchParams;
  const blogs = await getBlogs(author);
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-border bg-muted/10 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-foreground">
                The BUCC Blog
              </h1>
              <div className="mt-2 md:mt-4">
                <RefreshBlogsButton />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Stories, tutorials, and updates from the vibrant community of BRAC University Computer Club.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        {blogs.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-border rounded-lg bg-muted/10">
            <div className="space-y-4 max-w-xs mx-auto">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                <PenTool className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg text-muted-foreground">No blogs published yet</p>
                <p className="text-xs text-muted-foreground/60">Check back later for stories and updates.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Blog */}
            {featured && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary border-b border-border pb-4">
                  <PenTool size={14} /> Featured Story
                </div>
                <Card className="group border-border shadow-none overflow-hidden bg-card hover:border-primary/20 transition-all duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <Link href={`/blogs/${featured._id}`}>
                      <div className="h-full min-h-[300px] overflow-hidden relative bg-muted">
                        <img 
                          src={featured.featuredImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} 
                          alt={featured.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            Read Article <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                      <div className="space-y-2">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-[10px] font-bold uppercase tracking-widest">
                          {featured.category || "Blog"}
                        </Badge>
                        <Link href={`/blogs/${featured._id}`}>
                          <h2 className="font-serif text-3xl md:text-4xl group-hover:text-primary transition-colors line-clamp-3 leading-tight">
                            {featured.title}
                          </h2>
                        </Link>
                        <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed line-clamp-3">
                          {featured.description}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-border/50 flex flex-wrap items-center gap-4 text-xs font-light text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-primary" />
                          <span className="font-medium text-foreground">{featured.author?.authorName || "BUCC Member"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-primary" />
                          <span>{formatDate(featured.createdDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            )}

            {/* Rest of the Blogs Grid */}
            {rest.length > 0 && (
              <div className="space-y-6 pt-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-4">
                  All Articles
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((blog) => (
                    <Card key={blog._id} className="group border-border shadow-none overflow-hidden bg-card hover:border-primary/20 transition-all duration-500 flex flex-col">
                      <Link href={`/blogs/${blog._id}`}>
                        <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                          <img 
                            src={blog.featuredImage || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} 
                            alt={blog.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          <div className="absolute top-4 left-4">
                             <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none text-[9px] font-bold uppercase tracking-widest">
                               {blog.category || "Blog"}
                             </Badge>
                          </div>
                        </div>
                      </Link>
                      <CardContent className="p-6 flex flex-col flex-1 space-y-4">
                        <div className="space-y-2 flex-1">
                          <Link href={`/blogs/${blog._id}`}>
                            <h3 className="font-serif text-xl group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {blog.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground font-light line-clamp-3 leading-relaxed">
                            {blog.description}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-light">
                          <span className="font-medium truncate max-w-[120px]">{blog.author?.authorName || "BUCC Member"}</span>
                          <span>{formatDate(blog.createdDate)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
