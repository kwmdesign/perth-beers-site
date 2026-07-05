# Perth Beers — Workflow Cheat Sheet

Your setup: **Eleventy** (builds the site) + **Decap CMS** (`/admin`) + **Netlify** (hosting) + **GitHub** (stores everything).

---

## The one rule that prevents most problems

**Before you make code changes on your laptop, always run `git pull` first.**

Why: when you edit content in `/admin` and hit Publish, that saves a commit to GitHub. Your laptop doesn't know about it until you pull. Skip the pull and you'll hit the "rejected / diverged" error every time.

```
git pull --no-rebase --no-edit
```

---

## Two ways you change the site

| What you're changing | How | Goes live by |
| --- | --- | --- |
| **Content** — beers, trail stops | Edit in `/admin` → Publish | Netlify auto-rebuilds (~1 min) |
| **Code/layout** — design, sections, new features | Edit files locally → git push | Netlify auto-rebuilds (~1 min) |

Content = CMS. Structure = code. Everything deploys the same way once it's on GitHub.

---

## Everyday: making a code change locally

```
git pull --no-rebase --no-edit     # 1. get any CMS changes first
# ... make your edits / drop in new files ...
git add -A                         # 2. stage everything that changed
git commit -m "describe the change" # 3. snapshot it
git push                           # 4. send to GitHub → Netlify deploys
```

Then watch **Netlify → Deploys tab**. Green tick = live. Hard refresh the site with **Cmd + Shift + R** if you don't see it yet.

---

## Building & previewing locally (before you push)

```
npm run build      # build the site into the _site folder
open _site/index.html   # preview it in your browser
```

Or run a live preview server that reloads as you edit:

```
npm run serve      # then open the localhost URL it prints
```

---

## If you added a NEW Tailwind class to index.njk

The compiled CSS only contains classes that already existed. If you add a brand-new one (e.g. a colour or spacing you haven't used before), rebuild the stylesheet:

```
npm run css        # rebuilds src/css/tailwind.css
npm run build      # then rebuild the site
```

If you're not sure whether a class is new, running these never hurts.

---

## WHEN THINGS GO WRONG — error → fix

### "Updates were rejected... fetch first" / "non-fast-forward"
GitHub has commits you don't have locally (usually your own CMS publishes).

```
git pull --no-rebase --no-edit
git push
```

### "Your branch and 'origin/main' have diverged"
Same cause — you have local commits AND GitHub has commits. The pull merges them.

```
git pull --no-rebase --no-edit
git push
```

### The pull says "CONFLICT"
Rare (only if the same lines changed in both places). **Don't guess.** Note which file it names, and either ask for help, or if you know the fix: open the file, look for the `<<<<<<<`, `=======`, `>>>>>>>` markers, keep the version you want, delete the markers, then:

```
git add -A
git commit -m "resolve conflict"
git push
```

### "The current branch has no upstream branch"
First time pushing a new branch:

```
git push -u origin BRANCH-NAME
```

### Push asks for a password and rejects your account password
GitHub needs a **Personal Access Token**, not your login password. Generate one at
GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic),
tick **repo** (and **workflow** if pushing workflow files), and paste the token where it asks for a password.

### Saving a dotfile (like .gitignore) but it becomes ".gitignore.txt"
macOS keeps the `.txt`. Fix it in Terminal (avoids Finder's rename trouble):

```
mv .gitignore.txt .gitignore
```

---

## Checking the state of things (safe — these only LOOK, never change)

```
git status              # what's changed / am I ahead or behind GitHub?
git log --oneline -5    # last 5 commits
git remote -v           # confirm it points at your GitHub repo
git branch              # which branch am I on?
```

---

## Branches (for bigger experiments — optional)

A branch lets you build something risky without touching your live `main`.

```
git checkout -b my-experiment   # create + switch to a new branch
# ...work, commit as normal...
git push -u origin my-experiment  # (optional) back it up to GitHub

# when happy, merge it into main:
git checkout main
git merge my-experiment
git push
```

If an experiment goes wrong, just `git checkout main` and delete the branch — `main` was never touched.

---

## Where things live in your project

```
src/
├── index.njk          ← the page (layout, hero, sections)
├── _data/
│   ├── beers.json      ← beer content (also edited via /admin)
│   └── trail.json      ← trail content (also edited via /admin)
├── admin/
│   ├── index.html      ← the CMS page (/admin)
│   └── config.yml      ← describes what the CMS can edit
├── css/
│   ├── styles.css      ← hand-written styles
│   └── tailwind.css    ← generated — don't hand-edit
├── js/main.js          ← interactions (menu, slider, map)
└── assets/             ← logo & images

_site/                  ← the built site (generated — never edit, never commit)
.eleventy.js            ← Eleventy build config
tailwind.config.js      ← colours & fonts
```

---

## Quick facts

- **Live site:** https://www.perthbeers.au
- **CMS:** https://www.perthbeers.au/admin
- **GitHub repo:** github.com/kwmdesign/perth-beers-site
- **Host:** Netlify (auto-deploys on every push to `main`)
- **Colours:** black `#0D0D0D`, sand `#F5F0E6`, red `#E4223D`
- **GA4:** G-4VQGFJQWZL
