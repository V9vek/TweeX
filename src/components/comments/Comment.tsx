import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import CommentMoreButton from "./CommentMoreButton";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import ReplyInput from "./reply/ReplyInput";
import Reply from "./reply/Reply";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  const [activeReplyInputId, setActiveReplyInputId] = useState<string | null>(
    null
  );
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="group/comment flex gap-3 py-3">
        <span className="hidden sm:inline">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
            </Link>
          </UserTooltip>
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-1 text-sm">
            <UserTooltip user={comment.user}>
              <Link
                href={`/users/${comment.user.username}`}
                className="font-medium hover:underline"
              >
                {comment.user.displayName}
              </Link>
            </UserTooltip>
            <span className="text-muted-foreground">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>
          <div>{comment.content}</div>
          <div className="flex flex-row items-center">
            <Button
              variant={"ghost"}
              onClick={() => setActiveReplyInputId(comment.id)}
            >
              Reply
            </Button>
            {!!comment._count.replies && (
              <Button
                variant={"ghost"}
                onClick={() => setShowReplies(!showReplies)}
              >
                <div className="flex items-center flex-row gap-2">
                  {showReplies ? <ChevronDown /> : <ChevronUp />}
                  {comment._count?.replies} replies
                </div>
              </Button>
            )}
          </div>
          {comment.id === activeReplyInputId && (
            <ReplyInput
              comment={comment}
              setActiveReplyInputId={setActiveReplyInputId}
            />
          )}
        </div>
        {comment.user.id === user.id && (
          <CommentMoreButton
            comment={comment}
            className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
          />
        )}
      </div>
      {showReplies && comment.replies && (
        <div className="ml-6">
          {comment.replies.map((reply) => {
            return (
              <Reply
                key={reply.id}
                reply={reply as CommentData}
                comment={comment}
                currentUserId={user.id}
                isReplyInputOpen={reply.id === activeReplyInputId}
                setActiveReplyInputId={setActiveReplyInputId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
