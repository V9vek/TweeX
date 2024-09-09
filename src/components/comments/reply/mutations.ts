import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitReply } from "./actions";
import { CommentsPage } from "@/lib/types";

export function useSubmitReplyMutation(commentId: string, postId: string) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitReply,
    onSuccess: async (newReply) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            ...oldData,
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              ...page,
              comments: page.comments.map((comment) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                    _count: {
                      ...comment._count,
                      replies: (comment._count.replies || 0) + 1,
                    },
                  };
                }
                return comment;
              }),
            })),
          };
        }
      );

      toast({
        description: "Reply added",
        className: "bg-primary text-primary-foreground font-semibold",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit reply. Please try again.",
      });
    },
  });

  return mutation;
}
