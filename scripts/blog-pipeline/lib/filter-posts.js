const MIN_LENGTH = 60;

function filterCandidates(posts, { minLength = MIN_LENGTH } = {}) {
  return posts.filter((post) => post.text.trim().length >= minLength);
}

module.exports = { filterCandidates, MIN_LENGTH };
