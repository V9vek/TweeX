import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post)
      return Response.json({ error: "Post Not Found" }, { status: 404 });

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST request for LIKE
export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const likedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!likedPost)
      return Response.json({ error: "Post Not Found" }, { status: 404 });

    // incase some error goes, we use transaction: either all promises will resolve or none
    await prisma.$transaction([
      // T1: like
      prisma.like.upsert({
        where: {
          userId_postId: {
            postId: postId,
            userId: loggedInUser.id,
          },
        },
        create: {
          postId: postId,
          userId: loggedInUser.id,
        },
        update: {},
      }),
      // T2
      ...(loggedInUser.id !== likedPost.userId
        ? [
            // notification for like
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: likedPost.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE request for UNLIKE
export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unlikedPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!unlikedPost)
      return Response.json({ error: "Post Not Found" }, { status: 404 });

    await prisma.$transaction([
      // T1
      prisma.like.deleteMany({
        where: {
          postId: postId,
          userId: loggedInUser.id,
        },
      }),
      // T2
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: unlikedPost.userId,
          postId,
          type: "LIKE",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
