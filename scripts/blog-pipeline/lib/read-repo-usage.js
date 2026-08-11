// Announcements almost always link a repo without repeating the install line —
// the Aval launch linked github.com/pixel-point/aval and never mentioned
// `npx @pixel-point/aval-compiler`, so the post could not carry it.
//
// This is the only place the pipeline reads anything outside X, so it stays
// deliberately narrow: public repos linked from the source posts, the README's
// shell blocks, offered to the drafter as *candidates*. It does not decide
// which line is the install command. A README's first shell block is often a
// demo, a badge snippet, or a contributing step — a confidently wrong install
// command in a published post is worse than none.
const GITHUB_REPO_LINK = /https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)/g;
const SHELL_BLOCK = /```(?:sh|bash|shell|console)\n([\s\S]*?)```/g;
const MAX_REPOS = 3;
const MAX_SNIPPETS = 4;

function repoLinksIn(posts) {
  const seen = new Map();
  for (const post of posts) {
    const text = [post.text, ...(post.thread || []).map((reply) => reply.text)].join('\n');
    for (const [, owner, repo] of text.matchAll(GITHUB_REPO_LINK)) {
      // Strip a trailing .git or punctuation the regex may have caught.
      const name = repo.replace(/\.git$/, '');
      const key = `${owner}/${name}`;
      if (!seen.has(key)) seen.set(key, { owner, repo: name });
    }
  }
  return [...seen.values()].slice(0, MAX_REPOS);
}

function shellSnippetsIn(readme) {
  const snippets = [];
  for (const [, block] of readme.matchAll(SHELL_BLOCK)) {
    for (const line of block.split('\n')) {
      const trimmed = line.trim();
      // Comments and prompts carry no command; blank lines carry nothing.
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (!snippets.includes(trimmed)) snippets.push(trimmed);
      if (snippets.length >= MAX_SNIPPETS) return snippets;
    }
  }
  return snippets;
}

async function readRepoUsage({ posts, fetchImpl = fetch }) {
  const found = [];

  for (const { owner, repo } of repoLinksIn(posts)) {
    try {
      const res = await fetchImpl(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.raw' },
      });
      // A private, renamed or rate-limited repo costs this one snippet, not
      // the run — the article still has the link itself.
      if (!res.ok) continue;

      const snippets = shellSnippetsIn(await res.text());
      if (snippets.length > 0) found.push({ repo: `${owner}/${repo}`, snippets });
    } catch {
      // Same reasoning: never let reading a README fail a month's drafting.
    }
  }

  return found;
}

module.exports = { readRepoUsage, repoLinksIn, shellSnippetsIn };
