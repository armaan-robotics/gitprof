/**
 * template-engine.js — Loads templates/file1.md and replaces static content
 * with dynamic data. file1.md has no explicit placeholders; this module maps
 * known template sections to user/GitHub data via targeted replacements.
 */

/**
 * URL-encodes text for use in readme-typing-svg query parameters.
 * @param {string} text
 * @returns {string}
 */
function encodeForTypingSvg(text) {
  return encodeURIComponent(text).replace(/%20/g, '+');
}

/**
 * Builds the typing SVG markdown line from user data.
 * @param {string} name
 * @param {string[]} taglines
 * @returns {string}
 */
function buildTypingSvg(name, taglines) {
  const line1 = `Hey there, I'm ${name} 👋`;
  const extraLines = (taglines || []).map((t) => t.trim()).filter(Boolean);
  const allLines = extraLines.length > 0 ? [line1, ...extraLines] : [line1, 'Welcome to my profile'];
  const lines = allLines.map(encodeForTypingSvg).join(';');
  return `[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&pause=1000&color=58A6FF&center=true&vCenter=true&width=700&lines=${lines})](https://git.io/typing-svg)`;
}

/**
 * Builds the Connect With Me badges section.
 * @param {string} linkedin
 * @param {string} username
 * @returns {string}
 */
function buildConnectSection(linkedin, username) {
  const githubBadge = `[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${username})`;

  if (linkedin && linkedin.trim()) {
    const linkedinBadge = `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${linkedin.trim()})`;
    return `<div align="center">\n\n${linkedinBadge}\n${githubBadge}\n\n</div>`;
  }

  return `<div align="center">\n\n${githubBadge}\n\n</div>`;
}

/**
 * Builds skill badge markdown from comma-separated skills string.
 * @param {string} skillsInput
 * @returns {string}
 */
function buildSkillsSection(skillsInput) {
  const skills = skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (skills.length === 0) {
    return '_Add your skills to see them here._';
  }

  return skills
    .map((skill) => {
      const badge = skill.replace(/\s+/g, '_');
      return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(badge)}-58A6FF?style=for-the-badge)`;
    })
    .join('\n');
}

/**
 * Builds a single project block matching the template style.
 * @param {object} repo
 * @returns {string}
 */
function buildRepoBlock(repo) {
  const name = repo.name;
  const description = repo.description || 'No description provided.';
  const language = repo.language;
  const stars = repo.stargazers_count || 0;

  let techStack = '';
  if (language) {
    const badge = language.replace(/\s+/g, '_');
    techStack = `\n**Tech Stack:**\n\n![${language}](https://img.shields.io/badge/${encodeURIComponent(badge)}-58A6FF?style=for-the-badge&logoColor=white)\n`;
  }

  const starNote = stars > 0 ? ` ⭐ ${stars}` : '';

  return `### 📦 ${name}${starNote}
> ${description}
${techStack}
[![View Project](https://img.shields.io/badge/View_Project-58A6FF?style=for-the-badge&logo=github&logoColor=white)](${repo.html_url})`;
}

/**
 * Builds featured projects section from top repos by stars.
 * @param {object[]} repos
 * @param {string} username
 * @returns {string}
 */
function buildReposSection(repos, username) {
  const filtered = repos
    .filter((r) => !r.fork && r.name.toLowerCase() !== username.toLowerCase())
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, CONFIG.TOP_REPOS_COUNT);

  if (filtered.length === 0) {
    return '_No public repositories found._';
  }

  return filtered.map(buildRepoBlock).join('\n\n---\n\n');
}

/**
 * Formats the About Me section from user input and GitHub bio.
 * @param {string} about
 * @param {object} user
 * @returns {string}
 */
function buildAboutSection(about, user) {
  if (about.trim()) {
    const paragraphs = about.trim().split('\n').filter(Boolean);
    return paragraphs.map((p) => `${p}\n`).join('\n');
  }

  if (user.bio) {
    return `${user.bio}\n`;
  }

  return '_Tell visitors about yourself in the About field._\n';
}

/**
 * Replaces the About Me content block in the template.
 * @param {string} template
 * @param {string} aboutContent
 * @returns {string}
 */
function replaceAboutSection(template, aboutContent) {
  const aboutRegex = /(## 🧠 About Me\n\n)([\s\S]*?)(\n---)/;
  return template.replace(aboutRegex, `$1${aboutContent.trim()}\n$3`);
}

/**
 * Replaces the Skills section in the template.
 * @param {string} template
 * @param {string} skillsMarkdown
 * @returns {string}
 */
function replaceSkillsSection(template, skillsMarkdown) {
  const skillsRegex = /(## 🛠️ Skills & Tech Stack\n\n)([\s\S]*?)(\n---\n\n\n###)/;
  return template.replace(
    skillsRegex,
    `$1${skillsMarkdown}\n\n$3`
  );
}

/**
 * Replaces featured project blocks between skills and GitHub Stats.
 * @param {string} template
 * @param {string} reposMarkdown
 * @returns {string}
 */
function replaceReposSection(template, reposMarkdown) {
  const reposRegex = /(---\n\n\n### 💸 Budgetly[\s\S]*?)(---\n\n\n## 📊 GitHub Stats)/;
  if (reposRegex.test(template)) {
    return template.replace(
      reposRegex,
      `---\n\n\n${reposMarkdown}\n\n---\n\n\n## 📊 GitHub Stats`
    );
  }

  const fallbackRegex = /(## 🛠️ Skills[\s\S]*?---\n\n)([\s\S]*?)(\n---\n\n\n## 📊 GitHub Stats)/;
  return template.replace(fallbackRegex, `$1\n\n${reposMarkdown}\n$3`);
}

/**
 * Replaces the Connect With Me section.
 * @param {string} template
 * @param {string} linkedin
 * @param {string} username
 * @returns {string}
 */
function replaceConnectSection(template, linkedin, username) {
  const connectRegex = /(## 🔗 Connect With Me\n\n)([\s\S]*?)(\n---\n\n\n\n## 🛠️)/;
  return template.replace(connectRegex, `$1${buildConnectSection(linkedin, username)}\n$3`);
}

/**
 * Replaces the footer tagline using the first user tagline.
 * @param {string} template
 * @param {string[]} taglines
 * @returns {string}
 */
function replaceFooterTagline(template, taglines) {
  const firstTagline = (taglines || []).map((t) => t.trim()).find(Boolean) || '';
  const footerRegex = /\*Building real things — software that ships, hardware that moves\.\*/;
  const replacement = firstTagline ? `*${firstTagline}*` : '*Welcome to my GitHub profile.*';
  return template.replace(footerRegex, replacement);
}

/**
 * Replaces the typing SVG header block.
 * @param {string} template
 * @param {string} typingSvg
 * @returns {string}
 */
function replaceTypingSvg(template, typingSvg) {
  const typingRegex = /\[!\[Typing SVG\]\([\s\S]*?\)\]\(https:\/\/git\.io\/typing-svg\)/;
  return template.replace(typingRegex, typingSvg);
}

/**
 * Replaces all username occurrences and name references in stats URLs.
 * @param {string} template
 * @param {string} username
 * @param {string} name
 * @returns {string}
 */
function replaceUsernameAndName(template, username, name) {
  let result = template.replace(/armaan-robotics/g, username);
  result = result.replace(/Armaan\+Gupta/g, encodeForTypingSvg(name));
  result = result.replace(/Armaan Gupta/g, name);
  result = result.replace(/Armaan's/g, `${name.split(' ')[0]}'s`);
  return result;
}

/**
 * Loads the template and generates personalized markdown.
 * @param {object} params
 * @returns {Promise<string>}
 */
async function generateMarkdown(params) {
  const { user, repos, details } = params;
  const username = user.login;
  const name = details.name || user.name || username;
  const taglines = (details.taglines || []).map((t) => t.trim()).filter(Boolean);
  const about = details.about || '';
  const skills = details.skills || '';
  const linkedin = details.linkedin || '';

  const response = await fetch(CONFIG.TEMPLATE_PATH);
  if (!response.ok) {
    throw new Error('Failed to load template file.');
  }

  let template = await response.text();

  template = replaceTypingSvg(template, buildTypingSvg(name, taglines));
  template = replaceUsernameAndName(template, username, name);
  template = replaceAboutSection(template, buildAboutSection(about, user));
  template = replaceConnectSection(template, linkedin, username);
  template = replaceSkillsSection(template, buildSkillsSection(skills));
  template = replaceReposSection(template, buildReposSection(repos, username));
  template = replaceFooterTagline(template, taglines);

  return template;
}
