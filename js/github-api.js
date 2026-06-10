/**
 * github-api.js — Functions for calling the GitHub REST API.
 * Fetches user profile and repository data for a given username.
 */

/**
 * Fetches GitHub user profile and repositories for the given username.
 * @param {string} username
 * @returns {Promise<{ user: object, repos: object[] }>}
 */
async function fetchGitHubData(username) {
  const base = CONFIG.GITHUB_API_BASE;
  const userUrl = `${base}/users/${encodeURIComponent(username)}`;
  const reposUrl = `${base}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`;

  let userResponse;
  try {
    userResponse = await fetch(userUrl);
  } catch {
    throw { type: 'network' };
  }

  if (userResponse.status === 404) {
    throw { type: 'not_found', username };
  }

  if (userResponse.status === 403) {
    throw { type: 'rate_limit' };
  }

  if (!userResponse.ok) {
    throw { type: 'network' };
  }

  const user = await userResponse.json();

  let reposResponse;
  try {
    reposResponse = await fetch(reposUrl);
  } catch {
    throw { type: 'network' };
  }

  if (reposResponse.status === 403) {
    throw { type: 'rate_limit' };
  }

  if (!reposResponse.ok) {
    throw { type: 'network' };
  }

  const repos = await reposResponse.json();
  return { user, repos };
}
