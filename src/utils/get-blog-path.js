const { BLOG_BASE_PATH } = require('../constants/blog');

module.exports = function getBlogPath(category) {
  if (category) {
    return `${BLOG_BASE_PATH}${category.toLowerCase()}/`;
  }

  return BLOG_BASE_PATH;
};
