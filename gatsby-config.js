// Gatsby has dotenv by default
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

module.exports = {
  trailingSlash: 'always',
  flags: { DEV_SSR: process.env.GATSBY_DEV_SSR || false },
  siteMetadata: {
    siteTitle: 'Pixel Point — Web Design and Development',
    siteDescription: 'Design and development of JAMStack-based marketing websites',
    siteImage: '/images/social-preview.jpg',
    siteLanguage: 'en',
    siteUrl: process.env.GATSBY_DEFAULT_SITE_URL || 'http://localhost:8000',
  },
  plugins: [
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'case-studies',
        path: `${__dirname}/content/case-studies`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'post-authors',
        path: `${__dirname}/content/posts/post-authors.json`,
      },
    },
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          quality: 85,
          placeholder: 'none',
        },
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png',
      },
    },
    {
      resolve: 'gatsby-plugin-svgr-svgo',
      options: {
        inlineSvgOptions: [
          {
            test: /\.inline.svg$/,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'prefixIds',
                'removeDimensions',
              ],
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-embed-video',
            options: {
              width: 800,
              loadingStrategy: 'lazy',
              containerClass: 'embedVideo-container',
            },
          },
          'gatsby-remark-copy-linked-files',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 696,
              quality: 85,
              withWebp: true,
              showCaptions: true,
              linkImagesToOriginal: false,
              backgroundColor: 'white',
              disableBgImageOnAlpha: true,
            },
          },
          'gatsby-remark-prismjs',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-gatsby-cloud',
      options: {
        headers: {
          '/fonts/*': ['Cache-Control: public, max-age=31536000, immutable'],
          '/animations/*': ['Cache-Control: public, max-age=31536000, immutable'],
        },
      },
    },
    'gatsby-alias-imports',
    'gatsby-plugin-postcss',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: process.env.GATSBY_DEFAULT_SITE_URL || 'http://localhost:8000',
      },
    },
  ],
};
