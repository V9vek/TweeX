"use client";

import { FollowerInfo } from "@/lib/types";
import { Button } from "./ui/button";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { useToast } from "./ui/use-toast";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, initialState);
  // console.log(data);

  const queryKey: QueryKey = ["follower-info", userId];

  const mutation = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    // onMutate() is called before the mutationFn()
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      // if incase of error, rollback to previous state
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutation.mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
