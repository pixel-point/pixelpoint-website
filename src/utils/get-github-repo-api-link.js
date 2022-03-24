export default function getGithubRepoAPILink(username, repoName) {
  return `https://api.github.com/repos/${username}/${repoName}`;
}
