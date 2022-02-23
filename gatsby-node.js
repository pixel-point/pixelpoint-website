const path = require('path');

const { BLOG_BASE_PATH } = require('./src/constants/blog');
const { CASE_STUDIES_BASE_PATH } = require('./src/constants/case-studies');
const getBlogPostPath = require('./src/utils/get-blog-post-path');

// We have this variable in order to decide whether to render draft posts or not
// We are rendering ALL posts, including draft ones in development mode
// And we are skipping draft posts in production mode
// We have an array structure here in order to use it in the filter using the "in" operator
const DRAFT_FILTER = process.env.NODE_ENV === 'production' ? [false] : [true, false];

async function createBlogPage({ actions }) {
  const { createPage } = actions;

  createPage({
    path: BLOG_BASE_PATH,
    component: path.resolve('./src/templates/blog.jsx'),
    context: {
      draftFilter: DRAFT_FILTER,
      canonicalUrl: `${process.env.GATSBY_DEFAULT_SITE_URL}${BLOG_BASE_PATH}`,
    },
  });
}

async function createBlogPosts({ graphql, actions }) {
  const result = await graphql(`
    {
      allMdx(filter: { fileAbsolutePath: { regex: "/posts/" } }) {
        nodes {
          id
          slug
          fields {
            draft
          }
          frontmatter {
            title
            description
          }
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, slug, fields, frontmatter }) => {
    // Do not create a post in production if it's draft
    if (process.env.NODE_ENV === 'production' && fields.draft) return;

    // Required fields validation
    if (!frontmatter.title) {
      throw new Error(`Post with ID "${id}" does not have field "title"!`);
    }
    if (!frontmatter.description) {
      throw new Error(`Post "${frontmatter.title}" does not have field "description"!`);
    }

    actions.createPage({
      path: getBlogPostPath(slug),
      component: path.resolve('./src/templates/blog-post.jsx'),
      context: { id },
    });
  });
}

async function createCaseStudies({ graphql, actions }) {
  const result = await graphql(`
    {
      allMdx(filter: { fileAbsolutePath: { regex: "/case-studies/" } }) {
        nodes {
          id
          slug
          fields {
            draft
          }
          frontmatter {
            title
            description
          }
        }
      }
    }
  `);

  if (result.errors) throw new Error(result.errors);

  result.data.allMdx.nodes.forEach(({ id, slug, fields, frontmatter }) => {
    // Do not create a post in production if it's draft
    if (process.env.NODE_ENV === 'production' && fields.draft) return;

    // Required fields validation
    if (!frontmatter.title) {
      throw new Error(`Case Study with ID "${id}" does not have field "title"!`);
    }
    if (!frontmatter.description) {
      throw new Error(`Case Study "${frontmatter.title}" does not have field "description"!`);
    }

    actions.createPage({
      path: `${CASE_STUDIES_BASE_PATH}/${slug}`,
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
      name: 'draft',
      value: node.frontmatter.draft || false,
    });
  }
};

exports.createPages = async (options) => {
  await createBlogPage(options);
  await createBlogPosts(options);
  await createCaseStudies(options);
};
