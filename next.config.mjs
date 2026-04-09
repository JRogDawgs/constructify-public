let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  webpack: (config) => {
    // Disabling webpack cache makes every build extremely slow and often looks "stuck"
    // on Windows. Opt in only when debugging stale bundles: DISABLE_WEBPACK_CACHE=1 npm run build
    if (process.env.DISABLE_WEBPACK_CACHE === '1') {
      config.cache = false
    }
    return config
  },
  /* CSP: middleware.ts only — duplicate CSP here blocked <video> and conflicted with Firebase/Google rules. */
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
