import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";
export type { Post };
export async function getPosts() {
  return prisma.post.findMany({ select: { title: true, slug: true } });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown" | "language">
) {
  return prisma.post.create({ data: post });
}
