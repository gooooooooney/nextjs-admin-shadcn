/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        // https://avatars.githubusercontent.com/u/117963061?v=4
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["@zenstackhq/runtime"],
  }

};

export default config;
