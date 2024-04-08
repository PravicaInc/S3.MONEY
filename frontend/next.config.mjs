/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(
      rule => rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /jsx/] }, // exclude if *.svg?jsx
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: /jsx/, // *.svg?jsx
        use: {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              cleanupIDs: false,
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      removeTitle: false,
                      removeDesc: false,
                    },
                  },
                },
                {
                  name: 'removeUnknownsAndDefaults',
                  params: {
                    keepRoleAttr: true,
                  },
                },
                'cleanupIds',
                {
                  name: 'prefixIds',
                  params: {
                    prefix: () => `${Math.trunc(Math.random() * 10e5)}`,
                  },
                },
              ],
            },
          },
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
