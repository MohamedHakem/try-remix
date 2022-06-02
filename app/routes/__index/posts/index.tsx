import { json, Link, useLoaderData } from "remix";
import { getPosts } from "~/models/post.server";
import type { Post } from "~/post";
export const loader = async () => {
  return json(await getPosts());
};
export default function Posts() {
  const posts = useLoaderData<Post[]>();
  return (
    <main>
      <h1>Posts</h1>
      <section>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
    </main>
  );
}
