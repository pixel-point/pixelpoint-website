const path = require('path');

const get = require('lodash.get');

const { BLOG_BASE_PATH } = require('./src/constants/blog');
const { CASE_STUDIES_BASE_PATH } = require('./src/constants/case-studies');
const POST_AUTHORS = require('./src/constants/post-authors');
const getBlogPostPath = require('./src/utils/get-blog-post-path');

// We have this variable in order to decide whether to render draft posts or not
// We are rendering ALL posts, including draft ones in development mode
// And we are skipping draft posts in production mode
// We have an array structure here in order to use it in the filter using the "in" operator
const DRAFT_FILTER = process.env.NODE_ENV === 'production' ? [false] : [true, false];

const POST_REQUIRED_FIELDS = ['title', 'author', 'shortDescription', 'cover'];

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

async function createBlogPage({ actions }) {
  const { createPage } = actions;

  createPage({
    path: BLOG_BASE_PATH,
    component: path.resolve('./src/templates/blog.jsx'),
    context: {
      draftFilter: DRAFT_FILTER,
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
            isDraft
          }
          frontmatter {
            title
            author
            shortDescription
            cover {
              publicURL
            }
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

    if (!Object.keys(POST_AUTHORS).includes(frontmatter.author)) {
      throw new Error(
        `Post "${slug}" has unknown author "${
          frontmatter.author
        }"!\nAvailable authors: ${Object.keys(POST_AUTHORS).join(
          ', '
        )}.\nPlease check authors in "src/constants/post-authors.js"`
      );
    }

    actions.createPage({
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

    actions.createPage({
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

exports.createPages = async (options) => {
  await createBlogPage(options);
  await createBlogPosts(options);
  await createCaseStudiesPage(options);
  await createCaseStudies(options);
};
