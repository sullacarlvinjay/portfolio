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

Live site: https://sullacarlvinjay.github.io/portfolio/

## Responsive breakpoints

| Size | Width | What changes |
| --- | --- | --- |
| Mobile | up to 720px | Two-row top bar with scrollable nav, stacked single-column sections, centred hero, chat as a bottom sheet |
| Tablet | 721px – 960px | Side-by-side hero; skills, awards and contact stack into one column |
| Desktop | above 960px | Full two-column layouts for skills, awards and contact |

## Testing

| Browser / device | Screen size | Result | Notes |
| --- | --- | --- | --- |
| Chrome — HP Laptop 15-fc0xxx | Desktop 1536px (1920×1080 at 125% scale) | ✅ | |
| Edge — HP Laptop 15-fc0xxx | Desktop 1536px (1920×1080 at 125% scale) | ✅ | |
| Redmi Note 13 Pro+ 5G (Chrome) | Mobile ~393px | ✅ | Opened on mobile data, not Wi-Fi |
| iPad Air M3 (Safari) | Tablet 820px portrait | ✅ | Landscape shows the desktop layout |

### Bugs found and fixed

| Bug | Where | Fix |
| --- | --- | --- |
| Nav links made the page wider than the screen | Phones | Top bar grid uses `minmax(0, 1fr)` so the nav scrolls instead of stretching the page |
| Page zoomed in when tapping the chat box | iPhone (Safari) | Chat input font size set to 16px |
| Résumé PDF could not display inside the page | Android phones, in-app browsers | Phones show a résumé image instead of the PDF |
| Justified bio text left wide gaps between words | Narrow screens | Bio is left-aligned below 720px |
| Unused uploaded images in `assets/` | Repo | Removed files no page referenced |

### Checked

- [✔] All nav links jump to the right section
- [✔] Theme toggle switches and remembers the choice after reload
- [✔] Project carousel: arrows, dots, keyboard arrows, swipe
- [✔] Award tabs, photo collage and lightbox
- [✔] Resume viewer opens and closes (button, ✕, Escape)
- [✔] Chatbot opens, answers, and closes
- [✔] Email, GitHub and other contact links open correctly
- [✔] Live URL opens on another device and network

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

