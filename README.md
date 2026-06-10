# GitProf

GitProf is a static, client-side web app that helps you generate a polished GitHub profile README.md by combining data from the GitHub REST API with your own details (name, tagline, about, skills). Click **Enable** to download your README and view step-by-step instructions for adding it to your GitHub profile.

## Folder Structure

```
/index.html              Landing page
/builder.html            Multi-step wizard + Enable flow
/instructions.html       GitHub README setup instructions
/css/                    Stylesheets (base, layout, landing, wizard, preview, buttons)
/js/                     JavaScript modules (API, storage, wizard, template engine, etc.)
/templates/file1.md      README template used for generation
/assets/                 Icons and images (optional)
```

## Running Locally

Because the app uses `fetch()` to load `templates/file1.md` at runtime, you **must serve the project via a local static server** — opening `index.html` directly as a `file://` URL will not work.

**Option 1 — VS Code Live Server**

Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html`, and choose "Open with Live Server".

**Option 2 — npx serve**

```bash
npx serve .
```

**Option 3 — Python**

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## GitHub API Rate Limit

This app makes unauthenticated requests to the [GitHub REST API](https://docs.github.com/en/rest), which is limited to **60 requests per hour per IP address**. If you hit the limit, wait a few minutes and try again.

## Deployment Note

This is currently a local project intended for future deployment to a subdomain via Namecheap. No deployment-specific configuration is included yet.
"# gitprof" 
