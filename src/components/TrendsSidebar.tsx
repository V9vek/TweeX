import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden md:block lg:w-80 w-60 h-fit flex-none space-y-5">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
      {/* <div>Some random</div> */}
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  //   await new Promise((r) => setTimeout(r, 10000));

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: { id: user.id },
      // do not show those people to follow, whom I have already followed
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-lg font-bold">Who to follow</div>
      {usersToFollow.map((u) => {
        // console.log(u);
        return (
          <div key={u.id} className="flex items-center justify-between gap-3">
            <UserTooltip user={u}>
              <Link
                href={`/users/${u.username}`}
                className="flex items-center gap-3"
              >
                <UserAvatar avatarUrl={u.avatarUrl} className="flex-none" />
                <div>
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {u.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">
                    @{u.username}
                  </p>
                </div>
              </Link>
            </UserTooltip>
            <FollowButton
              key={u.id}
              userId={u.id}
              initialState={{
                followers: u._count.followers,
                isFollowedByUser: u.followers.some(
                  ({ followerId }) => followerId === user.id
                ),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// unstable_cache only works in Production

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
        SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) as hashtag, COUNT(*) as count
        FROM posts
        GROUP BY (hashtag)
        ORDER BY count DESC, hashtag ASC
        LIMIT 5
    `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  }
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
