const BLOG_BASE_PATH = '/blog/';
const BLOG_CATEGORIES = ['Development', 'Design', 'Misc'];
const BLOG_POSTS_PER_PAGE = 16;

// We are using ES modules here in order to be able to import variables from this file in gatsby-node.js
module.exports = {
  BLOG_BASE_PATH,
  BLOG_CATEGORIES,
  BLOG_POSTS_PER_PAGE,
};
