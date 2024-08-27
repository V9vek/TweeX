import { CommentsPage, PostData } from "@/lib/types";
import CommentInput from "./CommentInput";
import Comment from "./Comment";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface CommentProps {
  post: PostData;
}

export default function Comments({ post }: CommentProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) => {
        return kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
          )
          .json<CommentsPage>();
      },
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      // doing same things as Posts, just reversing the order of pages
      select: (data) => {
        return {
          pages: [...data.pages].reverse(),
          pageParams: [...data.pageParams].reverse(),
        };
      },
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-muted-foreground text-center">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => {
          return <Comment comment={comment} />;
        })}
      </div>
    </div>
  );
}
