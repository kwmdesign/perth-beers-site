# Perth Beers

A one-page craft beer guide for Western Australia. Static site — no server-side code. Tailwind's utility classes are precompiled to a static stylesheet (no runtime CDN, no in-browser compiling).

## Structure

```
perth-beers/
├── index.html              ← page markup
├── css/
│   ├── tailwind.css        ← precompiled Tailwind utilities (generated — don't hand-edit)
│   └── styles.css          ← custom component styles, animations, textures
├── js/
│   └── main.js              ← mobile menu, tabs, map tooltips, stat counters, form
├── assets/                   ← put any images/icons here as you add them
├── tailwind.config.js      ← Tailwind theme (custom colours/fonts) — used only when rebuilding
├── tailwind-input.css       ← the 3-line @tailwind source file — used only when rebuilding
├── .github/workflows/
│   └── deploy.yml            ← GitHub Action: FTPs to InfinityFree on every push to main
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

## Automated deploy via GitHub Actions (recommended)

One-time setup, then every future change is just `git push` — no FileZilla, no manual file picking.

**1. Create an empty GitHub repo.** On github.com, create a new repository (e.g. `perth-beers-site`). Don't initialise it with a README, .gitignore, or licence — this folder already has those, and an empty remote avoids a merge conflict on first push.

**2. Push this folder to it.** From inside the `perth-beers` folder:

```
git remote add origin https://github.com/YOUR-USERNAME/perth-beers-site.git
git branch -M main
git push -u origin main
```

**3. Get your FTP details.** Log into the InfinityFree client area → your hosting account → **FTP Details**. You'll see an FTP hostname (often `ftpupload.net`), an FTP username (something like `epiz_12345678`), and a password — that's your *hosting account / control panel* password, not your client-area login password.

**4. Add those as GitHub Secrets**, not anywhere in the code. On the GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**, add three:
- `FTP_SERVER` — the hostname from step 3
- `FTP_USERNAME` — the username from step 3
- `FTP_PASSWORD` — the password from step 3

These are encrypted by GitHub, never appear in logs, and nobody (including Claude) ever sees them — the workflow file only references them by name.

**5. Push again to trigger it.** Any push to `main` now runs `.github/workflows/deploy.yml`, which checks out the repo and FTPs only the changed files into `htdocs/` using the [FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action). Watch it run under the repo's **Actions** tab — a green check means it's live, a red X means something needs fixing (usually a typo in one of the three secrets).

From then on, making a change is:

```
git add -A && git commit -m "describe the change"
git push
```

Watch the Actions tab for the green check, then refresh the live site. That's the whole loop — no FileZilla, no manual file selection, no remembering which files changed.

## Publishing manually via FileZilla (fallback, or if you skip GitHub)

**1. Get your FTP details.** Same as step 3 above.

**2. Set up the connection in FileZilla.**
- File → Site Manager → New Site
- Protocol: **FTP**
- Host: the FTP hostname
- Port: **21**
- Logon Type: **Normal**
- User / Password: from your FTP Details

**3. Upload into `htdocs`.** InfinityFree serves whatever's inside the `htdocs` folder on your account. In FileZilla's remote (right-hand) panel, open `htdocs`, then drag in the *contents* of your local `perth-beers` folder — `index.html`, `css/`, `js/`, `assets/` — directly into `htdocs`. Don't upload the `perth-beers` folder itself as a subfolder, or your site will end up at `yoursite.com/perth-beers/` instead of `yoursite.com/`. You don't need `.github/`, `README.md`, `tailwind.config.js`, or `tailwind-input.css` on the server — those are dev-only files.

**4. Check it live.** Visit your InfinityFree domain. If you see a "your website is ready" placeholder instead of the site, double check the files landed inside `htdocs` and not one level above or below it.

Each time after that, reconnect and drag over just the file(s) you changed.

## If you add a new Tailwind class

This is the one gotcha the old CDN setup didn't have: `css/tailwind.css` only contains the utility classes that existed in `index.html` at build time. If you edit `index.html` and add a Tailwind class that wasn't already used somewhere on the page — say a new `bg-teal-700` or `lg:gap-20` — it will silently do nothing, because that rule doesn't exist in the compiled file yet.

To rebuild, with Node installed:

```
npx tailwindcss -i tailwind-input.css -o css/tailwind.css -c tailwind.config.js --minify
```

Run that from inside the `perth-beers` folder, then commit and push as usual (or re-upload `css/tailwind.css` via FileZilla if you're on the manual path). If you don't want to deal with Node locally, paste your changed `index.html` to Claude and ask it to rebuild the stylesheet — that's a quick, mechanical step.

## Version history

This folder is a local git repo with a full commit history. That gives you an undo button — if a change breaks something, you can see exactly what you edited and roll it back:

```
git status            # see what's changed
git log --oneline      # see your history
git revert <hash>      # undo a specific commit, keeping history intact
```

Once you've followed the GitHub Actions setup above, this history also lives on GitHub, which doubles as an off-machine backup and gives you the Actions tab as a deploy log — you can see exactly when each change went live and what was in it.

## Security note

Never commit your InfinityFree FTP password into this repo, into the workflow file, or into any file inside this folder — `.gitignore` is set up to ignore common credential file names as a safety net. The right place for it is GitHub's **Settings → Secrets and variables → Actions** (encrypted, write-only, never shown again after saving) if you're using the automated path, or FileZilla's Site Manager (which stores it locally, the same way a password manager would) if you're on the manual path.
