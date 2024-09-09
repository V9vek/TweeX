import { CommentData, PostData, UserData } from "@/lib/types";
import { useState } from "react";
import { CircleX, Loader2, SendHorizonal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubmitReplyMutation } from "./mutations";

interface ReplyInputProps {
  comment: CommentData;
  parent?: CommentData;
  currentUserId?: String;
  setActiveReplyInputId: (replyId: string | null) => void;
}

// when replying to only a Comment, parent is NULL

export default function ReplyInput({
  comment,
  parent,
  currentUserId,
  setActiveReplyInputId,
}: ReplyInputProps) {
  const [input, setInput] = useState(
    parent && parent.userId !== currentUserId
      ? `@${parent.user.displayName} `
      : ""
  );

  const mutation = useSubmitReplyMutation(comment.id, comment.postId!!);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        content: input,
        parentCommentId: comment.id,
      },
      {
        onSuccess: () => {
          setInput("");
          setActiveReplyInputId(null);
        },
      }
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder={"Add a reply..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={mutation.isPending}
        onClick={() => setActiveReplyInputId(null)}
      >
        <CircleX />
      </Button>
    </form>
  );
}
