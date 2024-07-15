import { env } from "@/env";

export const getGithubStar = async () => {
  const res = await fetch(`https://api.github.com/repos/${env.REPO}`);
  const json = await res.json() as any;
  return json.stargazers_count as number;
}