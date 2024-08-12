"use client";

import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    // queryFn: async () => {
    //   const res = await fetch("/api/posts/for-you");
    //   if (!res.ok) {
    //     throw Error(`Request failed with status code ${res.status}`);
    //   }
    //   return res.json();
    // },
    queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading the post 😵
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {query.data.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
}
