/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const get = require('lodash.get');
const fetch = require('node-fetch');

const { BLOG_CATEGORIES, BLOG_POSTS_PER_PAGE } = require('./src/constants/blog');
const { CASE_STUDIES_BASE_PATH } = require('./src/constants/case-studies');
const getBlogPath = require('./src/utils/get-blog-path');
const getBlogPostPath = require('./src/utils/get-blog-post-path');

const blogPostTemplate = path.resolve('./src/templates/blog-post.jsx');
const caseStudyTemplate = path.resolve('./src/templates/case-study.jsx');

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
            internal: { contentFilePath: { regex: "/content/posts/((?!post-authors).)*$/" } }
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
      allMdx(
        filter: {
          internal: { contentFilePath: { regex: "/content/posts/((?!post-authors).)*$/" } }
        }
        sort: { internal: { contentFilePath: DESC } }
      ) {
        nodes {
          id
          fields {
            isDraft
            slug
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
          internal {
            contentFilePath
          }
        }
      }
      # Query all video covers from all blog posts
      allFile(
        filter: { absolutePath: { regex: "/content/posts/" }, name: { regex: "/video-cover/" } }
      ) {
        nodes {
          name
          ext
          childImageSharp {
            gatsbyImageData(width: 970)
          }
          relativeDirectory
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, fields, frontmatter, internal: { contentFilePath } }) => {
    const { slug } = fields;

    // Do not create a post in production if it's draft
    if (process.env.NODE_ENV === 'production' && fields.isDraft) return;

    // Required fields validation
    POST_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Post "${contentFilePath}" does not have field "${fieldName}"!`);
      }
    });

    if (!BLOG_CATEGORIES.includes(frontmatter.category)) {
      throw new Error(
        `Post "${contentFilePath}" has unknown category "${
          frontmatter.category
        }"!\nAvailable categories: ${Object.keys(BLOG_CATEGORIES).join(
          ', '
        )}.\nPlease check categories in "src/constants/blog.js"`
      );
    }
    // Create an object containing all the video covers for all blog posts groped by post slug
    const allVideoCovers = result.data.allFile.nodes.reduce((acc, item) => {
      const { name, ext, childImageSharp, relativeDirectory } = item;
      const slug = `${relativeDirectory}`;
      if (!acc[slug]) {
        acc[slug] = {};
      }
      acc[slug][name + ext] = { childImageSharp };
      return acc;
    }, {});

    // Create a page for each blog post and pass context with video covers only for the current post
    createPage({
      path: getBlogPostPath(slug),
      component: `${blogPostTemplate}?__contentFilePath=${contentFilePath}`,
      context: { id, videoCovers: allVideoCovers[slug] },
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
      allMdx(filter: { internal: { contentFilePath: { regex: "/content/case-studies/" } } }) {
        nodes {
          id
          fields {
            isDraft
            slug
          }
          frontmatter {
            logo {
              url {
                publicURL
              }
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
            isHidden
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, fields, frontmatter, internal: { contentFilePath } }) => {
    // Do not create a case study in production if it's draft
    if (process.env.NODE_ENV === 'production' && fields.isDraft) return;

    // Required fields validation
    CASE_STUDY_REQUIRED_FIELDS.forEach((fieldName) => {
      if (!get(frontmatter, fieldName)) {
        throw new Error(`Case Study "${fields.slug}" does not have field "${fieldName}"!`);
      }
    });

    if (frontmatter.isFeatured) {
      FEATURED_CASE_STUDY_REQUIRED_FIELDS.forEach((fieldName) => {
        if (!get(frontmatter, fieldName)) {
          throw new Error(`Case Study "${fields.slug}" does not have field "${fieldName}"!`);
        }
      });
    }

    if (frontmatter.isOpenSource) {
      OPEN_SOURCE_CASE_STUDY_REQUIRED_FIELDS.forEach((fieldName) => {
        if (!get(frontmatter, fieldName)) {
          throw new Error(`Case Study "${fields.slug}" does not have field "${fieldName}"!`);
        }
      });
    }

    createPage({
      path: `${CASE_STUDIES_BASE_PATH}${fields.slug}`,
      component: `${caseStudyTemplate}?__contentFilePath=${contentFilePath}`,
      context: { id },
    });
  });
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  createNodeField({
    node,
    name: 'slug',
    value: node.internal.contentFilePath
      ? node.internal.contentFilePath.split('/').slice(-2, -1)[0]
      : '',
  });

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

    createNodeField({
      node,
      name: 'isHidden',
      value: node.frontmatter.isHidden || false,
    });
  }
};

exports.createResolvers = ({ createResolvers, cache }) => {
  createResolvers({
    Mdx: {
      githubStars: {
        type: 'String',
        resolve: async ({ frontmatter, internal: { contentFilePath } }) => {
          const { githubUsername, githubRepoName, isOpenSource } = frontmatter;

          if (
            contentFilePath.includes('/case-studies/') &&
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

exports.createPages = async (options) => {
  await createBlogPages(options);
  await createBlogPosts(options);
  await createCaseStudiesPage(options);
  await createCaseStudies(options);
};
