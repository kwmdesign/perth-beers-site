# Perth Beers

A one-page craft beer guide for Western Australia. Static site — no server-side code. Tailwind's utility classes are precompiled to a static stylesheet (no runtime CDN, no in-browser compiling).

## Structure

```
perth-beers/
├── index.html            ← page markup
├── css/
│   ├── tailwind.css      ← precompiled Tailwind utilities (generated — don't hand-edit)
│   └── styles.css        ← custom component styles, animations, textures
├── js/
│   └── main.js            ← mobile menu, tabs, map tooltips, stat counters, form
├── assets/                 ← put any images/icons here as you add them
├── tailwind.config.js    ← Tailwind theme (custom colours/fonts) — used only when rebuilding
├── tailwind-input.css     ← the 3-line @tailwind source file — used only when rebuilding
└── README.md
```

Tailwind's utility classes (`bg-roast`, `grid`, `text-sand`, etc.) used to load from `cdn.tailwindcss.com` and compile in the browser on every page load. That's fine for prototyping, but Tailwind itself warns it's not meant for production — it ships the whole compiler to every visitor and prints a console warning. `css/tailwind.css` is now a one-time, precompiled, minified file containing only the utility classes this page actually uses, generated with the Tailwind CLI. `tailwind.config.js` and `tailwind-input.css` are the *source* for that build — you don't need them to run the site, only to rebuild `css/tailwind.css` after a change (see below). Everything else — buttons, cards, tabs, the pulse animation, the corrugated-iron texture, the trail-stop timeline — is still hand-written plain CSS in `css/styles.css`.

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

## If you add a new Tailwind class

This is the one gotcha the old CDN setup didn't have: `css/tailwind.css` only contains the utility classes that existed in `index.html` at build time. If you edit `index.html` and add a Tailwind class that wasn't already used somewhere on the page — say a new `bg-teal-700` or `lg:gap-20` — it will silently do nothing, because that rule doesn't exist in the compiled file yet.

To rebuild, with Node installed:

```
npx tailwindcss -i tailwind-input.css -o css/tailwind.css -c tailwind.config.js --minify
```

Run that from inside the `perth-beers` folder, then re-upload the updated `css/tailwind.css` via FileZilla. If you don't want to deal with Node locally, paste your changed `index.html` to Claude and ask it to rebuild the stylesheet — that's a quick, mechanical step.

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
