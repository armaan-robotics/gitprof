/**
 * config.js — Application constants including GitHub API URLs,
 * localStorage keys, and wizard step configuration.
 */

const CONFIG = {
  GITHUB_API_BASE: 'https://api.github.com',
  STORAGE_KEYS: {
    USERNAME: 'gitprof_username',
    USER_DATA: 'gitprof_user_data',
    REPO_DATA: 'gitprof_repo_data',
    USER_DETAILS: 'gitprof_user_details',
    CURRENT_STEP: 'gitprof_current_step',
    GENERATED_MARKDOWN: 'gitprof_generated_markdown',
  },
  WIZARD: {
    TOTAL_STEPS: 2,
    STEP_GITHUB: 1,
    STEP_DETAILS: 2,
  },
  TEMPLATE_PATH: 'templates/file1.md',
  TOP_REPOS_COUNT: 6,
  MAX_TAGLINES: 3,
  ENABLE_DELAY_MS: 1500,
};
