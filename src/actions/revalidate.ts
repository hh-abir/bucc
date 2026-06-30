"use server";

import { revalidatePath } from "next/cache";

export async function revalidateBlogs() {
  revalidatePath("/blogs");
  revalidatePath("/blogs/[id]", "page");
}

export async function revalidateProjects() {
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
}

export async function revalidatePressReleases() {
  revalidatePath("/publications/press-releases");
  revalidatePath("/publications/press-releases/[id]", "page");
}
