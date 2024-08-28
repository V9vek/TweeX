"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const [newComment, _] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        userId: user.id,
        postId: post.id,
      },
      include: getCommentDataInclude(user.id),
    }),

    // notification for comment
    ...(post.user.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: {
      userId: true,
      post: true,
      postId: true,
    },
  });

  if (!comment) throw new Error("Comment does not exist 🤨");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const [deletedComment, _] = await prisma.$transaction([
    prisma.comment.delete({
      where: { id },
      include: getCommentDataInclude(user.id),
    }),

    prisma.notification.deleteMany({
      where: {
        issuerId: user.id,
        recipientId: comment.post.userId,
        postId: comment.postId,
        type: "COMMENT",
      },
    }),
  ]);

  return deletedComment;
}
