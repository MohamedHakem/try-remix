import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
export type PostMarkdownAttributes = {
  title: string;
};
export type Post = {
  title: string;
  slug: string;
  markdown: string;
  language: string;
};
const enPostsPath = path.join(__dirname, "..", "posts", "en");
const hebPostsPath = path.join(__dirname, "..", "posts", "he");
function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}
export async function getEnglishPosts(): Promise<Post[]> {
  const dir = await fs.readdir(enPostsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(enPostsPath, filename));
      const { attributes, body } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: attributes.title,
        language: "en",
        markdown: body,
      };
    })
  );
}
export async function getHebrewPosts(): Promise<Post[]> {
  const dir = await fs.readdir(hebPostsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(hebPostsPath, filename));
      const { attributes, body } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: `he-${filename.replace(/\.mdx$/, "")}`,
        title: attributes.title,
        language: "he",
        markdown: body,
      };
    })
  );
}

export async function getPosts() {
  const hebrew = await getHebrewPosts();
  const english = await getEnglishPosts();
  return english.concat(hebrew);
}
