import { useEffect, useState } from 'react';

export default function useGithubRepoStars(username, repoName) {
  const [githubStars, setGithubStars] = useState(0);

  useEffect(() => {
    if (fetch) {
      fetch(`https://api.github.com/repos/${username}/${repoName}`)
        .then((response) => response.json())
        .then(({ stargazers_count }) =>
          setGithubStars(new Intl.NumberFormat('en-US').format(stargazers_count))
        );
    }
  }, [username, repoName]);

  return githubStars;
}
