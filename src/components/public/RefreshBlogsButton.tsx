"use client";

import { revalidateBlogs } from "@/actions/revalidate";
import RefreshButton from "./RefreshButton";

export default function RefreshBlogsButton() {
  return <RefreshButton revalidateAction={revalidateBlogs} label="Blogs" />;
}
