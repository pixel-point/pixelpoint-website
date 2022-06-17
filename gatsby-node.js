/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const get = require('lodash.get');
const md5 = require('md5');
const fetch = require('node-fetch');

const { BLOG_CATEGORIES, BLOG_POSTS_PER_PAGE } = require('./src/constants/blog');
const { CASE_STUDIES_BASE_PATH } = require('./src/constants/case-studies');
const highlightedTweets = require('./src/constants/highlighted-tweets');
const getBlogPath = require('./src/utils/get-blog-path');
const getBlogPostPath = require('./src/utils/get-blog-post-path');

// We have this variable in order to decide whether to render draft posts or not
// We are rendering ALL posts, including draft ones in development mode
// And we are skipping draft posts in production mode
// We have an array structure here in order to use it in the filter using the "in" operator
const DRAFT_FILTER = process.env.NODE_ENV === 'production' ? [false] : [true, false];

const POST_REQUIRED_FIELDS = ['title', 'summary', 'category', 'author', 'cover'];

const CASE_STUDY_REQUIRED_FIELDS = [
  'logo',
  'title',
  'description',
  'websiteUrl',
  'services',
  'stack',
  'keynotes',
  'position',
];
const FEATURED_CASE_STUDY_REQUIRED_FIELDS = ['cover'];
const OPEN_SOURCE_CASE_STUDY_REQUIRED_FIELDS = ['githubUsername', 'githubRepoName'];

async function createBlogPages({ graphql, actions }) {
  const { createPage } = actions;

  const result = await graphql(
    `
      query ($draftFilter: [Boolean]!) {
        allMdx(
          filter: {
            fileAbsolutePath: { regex: "/posts/" }
            fields: { isDraft: { in: $draftFilter } }
          }
        ) {
          nodes {
            frontmatter {
              category
            }
          }
          totalCount
        }
      }
    `,
    { draftFilter: DRAFT_FILTER }
  );

  if (result.errors) throw new Error(result.errors);

  const pageCount = Math.ceil(result.data.allMdx.totalCount / BLOG_POSTS_PER_PAGE);

  Array.from({ length: pageCount }).forEach((_, index) => {
    createPage({
      path: getBlogPath({ pageNumber: index + 1 }),
      component: path.resolve('./src/templates/blog.jsx'),
      context: {
        currentPageIndex: index,
        pageCount,
        limit: BLOG_POSTS_PER_PAGE,
        skip: index * BLOG_POSTS_PER_PAGE,
        draftFilter: DRAFT_FILTER,
      },
    });
  });

  BLOG_CATEGORIES.forEach((category) => {
    const postsForCategory = result.data.allMdx.nodes.filter(
      ({ frontmatter }) => frontmatter.category === category
    );

    const pageCount = Math.ceil(postsForCategory.length / BLOG_POSTS_PER_PAGE);

    Array.from({ length: pageCount }).forEach((_, index) => {
      createPage({
        path: getBlogPath({ pageNumber: index + 1, category }),
        component: path.resolve('./src/templates/blog.jsx'),
        context: {
          category,
          currentPageIndex: index,
          pageCount,
          limit: BLOG_POSTS_PER_PAGE,
          skip: index * BLOG_POSTS_PER_PAGE,
          draftFilter: DRAFT_FILTER,
        },
      });
    });
  });
}

async function createBlogPosts({ graphql, actions }) {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMdx(filter: { fileAbsolutePath: { regex: "/posts/" } }) {
        nodes {
          id
          slug
          fields {
            isDraft
          }
          frontmatter {
            title
            author
            summary
            cover {
              publicURL
            }
            category
          }
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, slug, fields, frontmatter }) => {
    // Do not create a post in production if it's draft
    if (process.env.NODE_ENV === 'production' && fields.isDraft) return;

    // Required fields validation
    POST_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Post "${slug}" does not have field "${fieldName}"!`);
      }
    });

    if (!BLOG_CATEGORIES.includes(frontmatter.category)) {
      throw new Error(
        `Post "${slug}" has unknown category "${
          frontmatter.category
        }"!\nAvailable categories: ${Object.keys(BLOG_CATEGORIES).join(
          ', '
        )}.\nPlease check categories in "src/constants/blog.js"`
      );
    }

    createPage({
      path: getBlogPostPath(slug),
      component: path.resolve('./src/templates/blog-post.jsx'),
      context: { id },
    });
  });
}

async function createCaseStudiesPage({ actions }) {
  const { createPage } = actions;

  createPage({
    path: CASE_STUDIES_BASE_PATH,
    component: path.resolve('./src/templates/case-studies.jsx'),
    context: {
      draftFilter: DRAFT_FILTER,
    },
  });
}

async function createCaseStudies({ graphql, actions }) {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMdx(filter: { fileAbsolutePath: { regex: "/case-studies/" } }) {
        nodes {
          id
          slug
          fields {
            isDraft
          }
          frontmatter {
            logo {
              publicURL
            }
            title
            description
            websiteUrl
            githubUsername
            githubRepoName
            quote {
              text
              authorName
              authorPosition
              authorPhoto {
                publicURL
              }
            }
            services
            stack
            keynotes
            position
            cover {
              publicURL
            }
            isFeatured
            isOpenSource
          }
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, slug, fields, frontmatter }) => {
    // Do not create a case study in production if it's draft
    if (process.env.NODE_ENV === 'production' && fields.isDraft) return;

    // Required fields validation
    CASE_STUDY_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Case Study "${slug}" does not have field "${fieldName}"!`);
      }
    });

    if (frontmatter.isFeatured) {
      FEATURED_CASE_STUDY_REQUIRED_FIELDS.forEach((fieldName) => {
        if (!get(frontmatter, fieldName)) {
          throw new Error(`Case Study "${slug}" does not have field "${fieldName}"!`);
        }
      });
    }

    if (frontmatter.isOpenSource) {
      OPEN_SOURCE_CASE_STUDY_REQUIRED_FIELDS.forEach((fieldName) => {
        if (!get(frontmatter, fieldName)) {
          throw new Error(`Case Study "${slug}" does not have field "${fieldName}"!`);
        }
      });
    }

    createPage({
      path: `${CASE_STUDIES_BASE_PATH}${slug}`,
      component: path.resolve('./src/templates/case-study.jsx'),
      context: { id },
    });
  });
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.frontmatter) {
    createNodeField({
      node,
      name: 'isDraft',
      value: node.frontmatter.isDraft || false,
    });

    createNodeField({
      node,
      name: 'isFeatured',
      value: node.frontmatter.isFeatured || false,
    });

    createNodeField({
      node,
      name: 'isOpenSource',
      value: node.frontmatter.isOpenSource || false,
    });
  }
};

exports.createResolvers = ({ createResolvers, cache }) => {
  createResolvers({
    Mdx: {
      githubStars: {
        type: 'String',
        resolve: async ({ frontmatter, fileAbsolutePath }) => {
          const { githubUsername, githubRepoName, isOpenSource } = frontmatter;

          if (
            fileAbsolutePath.includes('/case-studies/') &&
            isOpenSource &&
            githubUsername &&
            githubRepoName
          ) {
            try {
              let stars;
              // Set expiration time as 24 hours in milliseconds
              const expirationTime = 24 * 60 * 60 * 1000;
              const cacheKey = `stars-${githubUsername}-${githubRepoName}`;
              const cacheStarsData = await cache.get(cacheKey);
              // Use cache if it is not expired
              if (cacheStarsData && cacheStarsData.created > Date.now() - expirationTime) {
                stars = cacheStarsData.stars;
              } else {
                // Use setTimeout to avoid hitting GitHub API rate limit with a random delay with interval from 500ms to 1500ms
                await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000 + 500));
                const response = await fetch(
                  `https://api.github.com/repos/${githubUsername}/${githubRepoName}`
                );
                const { stargazers_count } = await response.json();
                if (!stargazers_count) {
                  throw new Error(
                    `Failed to fetch GitHub stars for case study "${githubUsername}/${githubRepoName}"`
                  );
                }
                stars = new Intl.NumberFormat('en-US').format(stargazers_count);
                await cache.set(cacheKey, {
                  stars,
                  created: Date.now(),
                });
              }

              return stars;
            } catch (error) {
              console.log(error);
              throw new Error(
                `Failed to fetch GitHub stars for case study "${githubUsername}/${githubRepoName}"`
              );
            }
          }

          return null;
        },
      },
    },
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type Mdx implements Node { 
      author: PostAuthorsJson @link(by: "name", from: "frontmatter.author")
    }
  `);
};

exports.sourceNodes = async ({ actions, createContentDigest }) => {
  function generateNode(tweet, contentDigest, type) {
    return {
      ...tweet,
      id: md5(tweet.id),
      tweet_id: tweet.id,
      children: [],
      parent: `__SOURCE__`,
      internal: {
        type,
        contentDigest,
      },
    };
  }

  const { createNode } = actions;

  function createNodes(tweets, nodeType) {
    tweets.forEach((tweet) => {
      createNode(generateNode(tweet, createContentDigest(tweet), nodeType));
    });
  }

  try {
    const { data, includes } = await fetch(
      `https://api.twitter.com/2/tweets?ids=${Object.keys(highlightedTweets).join(
        ','
      )}&tweet.fields=entities,public_metrics&expansions=attachments.media_keys,entities.mentions.username&media.fields=height,media_key,preview_image_url,type,url,width,variants`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    ).then((response) => response.json());

    const nodeType = 'highlightedTweet';

    const dataWithMedia = data.map((tweet) => {
      const newTweet = { ...tweet };

      if (tweet.attachments?.media_keys) {
        const media = [];
        tweet.attachments.media_keys.forEach((mediaKey) => {
          media.push(includes.media.find((media) => media.media_key === mediaKey));
        });
        newTweet.media = media;
      }

      return newTweet;
    });

    if (dataWithMedia.length > 0) {
      createNodes(dataWithMedia, nodeType);
    } else {
      throw new Error('Failed to fetch highlighted tweets');
    }

    return Promise.resolve();
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch highlighted tweets');
  }
};

exports.createPages = async (options) => {
  await createBlogPages(options);
  await createBlogPosts(options);
  await createCaseStudiesPage(options);
  await createCaseStudies(options);
};
