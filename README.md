# Perth Beers

A one-page craft beer guide for Western Australia. Static site — no build step, no server-side code.

## Structure

```
perth-beers/
├── index.html        ← page markup
├── css/
│   └── styles.css    ← custom component styles, animations, textures
├── js/
│   └── main.js        ← mobile menu, tabs, map tooltips, stat counters, form
├── assets/             ← put any images/icons here as you add them
└── README.md
```

Tailwind's utility classes (`bg-roast`, `grid`, `text-sand`, etc.) are loaded from a CDN and compiled in the browser, so you won't find a `tailwind.config.js` here — the small config object lives in a `<script>` tag in `index.html`'s `<head>`, right after the CDN `<script>` tag. That's intentional: Tailwind's in-browser compiler needs it there to pick up the custom colours (`roast`, `sand`, `rust`) and fonts. Everything else — buttons, cards, tabs, the pulse animation, the corrugated-iron texture — is hand-written plain CSS in `css/styles.css`.

## Editing locally

Open `index.html` directly in a browser (double-click it, or drag it into a browser window) — every asset is either a relative path (`css/styles.css`, `js/main.js`) or a remote CDN link, so it works straight off disk with no local server required.

If you'd rather preview with a local server (handy if your editor has live-reload), from inside the `perth-beers` folder:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Publishing to InfinityFree via FileZilla

**1. Get your FTP details.** Log into the InfinityFree client area → your hosting account → **FTP Details**. You'll see an FTP hostname (often `ftpupload.net`), an FTP username (something like `epiz_12345678`), and a password. That password is your *hosting account / control panel* password, not your client-area login password — if FileZilla rejects it, that's the usual culprit.

**2. Set up the connection in FileZilla.**
- File → Site Manager → New Site
- Protocol: **FTP**
- Host: the FTP hostname from step 1
- Port: **21**
- Logon Type: **Normal**
- User / Password: from step 1
- Connect

**3. Upload into `htdocs`.** InfinityFree serves whatever's inside the `htdocs` folder on your account. In FileZilla's remote (right-hand) panel, open `htdocs`, then drag in the *contents* of your local `perth-beers` folder — `index.html`, `css/`, `js/`, `assets/` — directly into `htdocs`. Don't upload the `perth-beers` folder itself as a subfolder, or your site will end up at `yoursite.com/perth-beers/` instead of `yoursite.com/`.

**4. Check it live.** Visit your InfinityFree domain. If you see a "your website is ready" placeholder instead of the site, double check the files landed inside `htdocs` and not one level above or below it.

## Making changes after that

Each time you edit a file locally:
1. Preview the change (open `index.html` in a browser, or refresh if using the local server).
2. Reconnect in FileZilla and drag over just the file(s) you changed — FileZilla will prompt to overwrite, that's expected.

You don't need to re-upload everything each time, only what changed. If you ever add new images, drop them in `assets/` and reference them in `index.html` as `assets/your-image.jpg`.

## Version history (optional but recommended)

This folder is already a local git repo (`git init` was run, with an initial commit). That gives you an undo button — if a change breaks something, you can see exactly what you edited and roll it back:

```
git status            # see what's changed
git add -A && git commit -m "describe the change"   # snapshot it
git log --oneline      # see your history
```

This is local-only for now (no GitHub remote configured), so it won't affect your FileZilla workflow at all — it's just a safety net on your own machine. If you later want off-machine backups or want to explore automated deploys, push this repo to GitHub and it's a small step from there to a GitHub Action that FTPs on every push.

## Security note

Never commit your InfinityFree FTP password into this repo (or paste it into a file inside this folder) — `.gitignore` is set up to ignore common credential file names as a safety net, but the simplest approach is to just let FileZilla's Site Manager remember it for you, the same way a password manager would.
