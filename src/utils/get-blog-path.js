const { BLOG_BASE_PATH } = require('../constants/blog');

module.exports = function getBlogPath({ category, pageNumber }) {
  if (category && pageNumber && pageNumber !== 1) {
    return `${BLOG_BASE_PATH}${category.toLowerCase()}/${pageNumber}/`;
  }

  if (category) {
    return `${BLOG_BASE_PATH}${category.toLowerCase()}/`;
  }

  if (pageNumber && pageNumber !== 1) {
    return `${BLOG_BASE_PATH}${pageNumber}/`;
  }

  return BLOG_BASE_PATH;
};
