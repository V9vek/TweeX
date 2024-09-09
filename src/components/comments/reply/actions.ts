"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitReply({
  parentCommentId,
  content,
}: {
  parentCommentId: string;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const [newReply] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        userId: user.id,
        parentCommentId: parentCommentId,
      },
      include: getCommentDataInclude(user.id),
    }),

    // notification for comment
    // ...(post.user.id !== user.id
    //   ? [
    //       prisma.notification.create({
    //         data: {
    //           issuerId: user.id,
    //           recipientId: post.user.id,
    //           postId: post.id,
    //           type: "COMMENT",
    //         },
    //       }),
    //     ]
    //   : []),
  ]);

  return newReply;
}
