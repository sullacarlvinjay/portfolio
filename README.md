# Carlvin Jay Sulla — Portfolio

Static portfolio site (HTML/CSS/JS). Every piece of text and every image comes from `content/*.json`, which you edit through **Pages CMS**.

## Preview locally

The page loads its content with `fetch`, so it must be served over HTTP (double-clicking `index.html` won't work):

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Edit content

1. Push this folder to a GitHub repository.
2. Go to https://app.pagescms.org, sign in with GitHub, and open the repo.
3. Edit any section and click **Save**. Pages CMS commits the change, and GitHub Pages redeploys.

What's editable is defined in `.pages.yml`. Uploaded images and files go to `assets/`.

## Deploy on GitHub Pages

Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / root → Save.
The site goes live at `https://<username>.github.io/<repo>/`. If the repo is named `<username>.github.io`, it goes live at `https://<username>.github.io/`.

## Structure

```
index.html          all six sections
css/style.css       design (colour tokens at the top)
js/main.js          renders content, carousel, collage, chatbot
content/*.json      the editable content
assets/             web-sized images, logos, certificates (used by the site)
assets/originals/   full-resolution originals of every photo (backup, not loaded by the site)
.pages.yml          Pages CMS form definitions
```

## Chatbot

`askAssistant()` in `js/main.js` currently answers from the content files. It will later call a Gemini proxy (a Cloudflare Worker) so the API key never reaches the browser.
