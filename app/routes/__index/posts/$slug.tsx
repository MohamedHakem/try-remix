import renderMarkdown from "~/render-markdown";
import type { LoaderFunction } from "remix";
import { json, LinksFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import type { Post } from "~/models/post.server";
import { getPost } from "~/models/post.server";
import styles from "~/styles/post.css";
import { usePreferDark } from "~/utils/hooks/usePreferDark";
type LoaderData = {
  post: Post;
  html: string;
};
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};
export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  const post = await getPost(params.slug);
  invariant(post, "expected post to exist");

  return json({ post });
};

export default function PostSlug() {
  const { post } = useLoaderData();
  const isPreferDark = usePreferDark();
  const html = renderMarkdown(post.markdown, isPreferDark);

  return (
    <section className="bg-slate-100 px-10 py-5 text-base leading-6	">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
