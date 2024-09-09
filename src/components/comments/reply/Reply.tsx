import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import ReplyInput from "./ReplyInput";
import { useState } from "react";
import Linkify from "@/components/Linkify";
import Link from "next/link";

interface ReplyProps {
  reply: CommentData;
  comment: CommentData;
  currentUserId?: String;
  isReplyInputOpen: Boolean;
  setActiveReplyInputId: (replyId: string | null) => void;
}

export default function Reply({
  reply,
  comment,
  currentUserId,
  isReplyInputOpen,
  setActiveReplyInputId,
}: ReplyProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="group/comment flex gap-3 py-3">
        <span className="hidden sm:inline">
          <UserTooltip user={reply.user}>
            <Link href={`/users/${reply.user.username}`}>
              <UserAvatar avatarUrl={reply.user.avatarUrl} size={40} />
            </Link>
          </UserTooltip>
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-1 text-sm">
            <UserTooltip user={reply.user}>
              <Link
                href={`/users/${reply.user.username}`}
                className="font-medium hover:underline"
              >
                {reply.user.displayName}
              </Link>
            </UserTooltip>
            <span className="text-muted-foreground">
              {formatRelativeDate(reply.createdAt)}
            </span>
          </div>
          <Linkify>
            <div>{reply.content}</div>
          </Linkify>
          <Button
            variant={"ghost"}
            onClick={() => setActiveReplyInputId(reply.id)}
            className="rounded-md text-sm font-semibold"
          >
            Reply
          </Button>
          {isReplyInputOpen && (
            <ReplyInput
              comment={comment}
              parent={reply}
              currentUserId={currentUserId}
              setActiveReplyInputId={setActiveReplyInputId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
