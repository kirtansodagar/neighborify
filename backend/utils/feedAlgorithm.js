function getRawEngagement(post) {
  const likes = Number(post?.likesCount ?? post?.likes?.length ?? 0);
  const comments = Number(post?.commentsCount ?? post?.comments?.length ?? 0);
  const shares = Number(post?.sharesCount ?? post?.shares?.length ?? 0);
  const saves = Number(post?.savesCount ?? post?.saves?.length ?? 0);

  return likes * 1 + comments * 2 + shares * 3 + saves * 2;
}

function getRecencyScore(createdAt) {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);

  if (ageHours < 1) return 1.0;
  if (ageHours < 6) return 0.9;
  if (ageHours < 24) return 0.7;
  if (ageHours < 72) return 0.4;
  if (ageHours < 168) return 0.2;
  return 0.05;
}

export function computeFeedScore(post, pincodeAvgEngagement, distanceContext) {
  const recencyScore = getRecencyScore(post?.createdAt || new Date());
  const rawEngagement = getRawEngagement(post);
  const engagementScore = Math.min(rawEngagement / (pincodeAvgEngagement || 10), 1.0);
  const normalizedDistanceContext = Number(distanceContext ?? 1.0);
  const score = recencyScore * 0.4 + engagementScore * 0.3 + normalizedDistanceContext * 0.3;

  return Math.round(score * 100);
}

export function computePincodeAverageEngagement(posts) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return 0;
  }

  const total = posts.reduce((sum, post) => sum + getRawEngagement(post), 0);
  return total / posts.length;
}
