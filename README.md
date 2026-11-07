# Omarchy Yacht Club

Public website for **Omarchy Yacht Club** — a community for sailors who run [Omarchy](https://omarchy.org) Linux.

- **Site:** https://omarchyyc.org  
- **Repo:** https://github.com/shieldsworks/omarchyyc  
- **Redirect:** omarchyyachtclub.org → omarchyyc.org (DNS / GoDaddy)

## Stack

Plain static HTML, CSS, and JavaScript. No deployment build step. Hosted on Vercel (import this repo at [vercel.com/new](https://vercel.com/new)).

## Branding

Auto follows the browser light or dark preference. Dark keeps the original Tokyo Night base. Light uses Catppuccin Latte. Visitors can also select a built-in Omarchy theme in the header. The choice stays in this browser through localStorage.

The original dark tokens are:

| Token | Value |
|-------|--------|
| Background | `#1a1b26` |
| Brand | `#2ac3de` |
| Text | `#c0caf5` |
| Sans | Geist |
| Mono | JetBrains Mono |

Assets in `assets/` include the official Omarchy logo and wordmark (from [omarchy.org/brand](https://omarchy.org/brand)) plus the Yacht Club sail mark (`oyc-mark`, `oyc-sheet`).

## Pages

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/meetups` | Meetups (placeholder until dates exist) |
| `/photos` | Gallery |
| `/members` | Opt-in member directory |
| `/merch` | Coming soon |
| `/join` | Membership form |


## Theme palettes

`themes/palettes.json` snapshots all 23 built-in `colors.toml` palettes from the installed Omarchy `4.0.0.alpha` package on November 6, 2026. The files live under `/usr/share/omarchy/themes` on this VM. The upstream source is [Omarchy themes](https://github.com/basecamp/omarchy/tree/master/themes). Custom user themes are not included.

`python3 scripts/build-themes.py` regenerates `css/themes.css`, the head startup script, and the header selector on every HTML page. Deployment serves these checked-in files directly. The generator uses only Python 3's standard library and is not needed to serve the site.

Every generated color comes from that theme's palette. Text and accent candidates must reach WCAG AA 4.5:1 against all site surfaces. If an accent is too faint, another palette color replaces it. Button text also reaches 4.5:1. The fixed-color logos keep dark backing panels. Photo credits keep a fixed opaque dark background for contrast over any image.

The selector uses a native labeled select. The inline head script applies a valid saved choice before rendering. Auto follows live system preference changes through CSS. If storage is unavailable, selection works for the current page. With JavaScript disabled, Auto still works and the inactive selector stays hidden. The Google-hosted membership form and branding images retain their own colors. The site cannot detect an installed Omarchy theme automatically.

## Verify themes

Start the local preview server. Install Playwright outside the repo, then run the browser checks with a local Chromium binary:

```bash
npm install --prefix /tmp/oyc-tests playwright@1.65.0
NODE_PATH=/tmp/oyc-tests/node_modules CHROMIUM=/usr/bin/chromium node scripts/test-themes.cjs
```

The checks cover every page and theme at desktop and mobile widths, text contrast, keyboard selection, persistence, cross-tab changes, Auto, invalid or blocked storage, inline startup, and no-JavaScript fallback. `TEST_URL` overrides the default preview URL `http://127.0.0.1:8765`. `SCREENSHOT` sets the screenshot file path. CI runs the same checks with Playwright's Chromium.

## Member directory

Members appear on `/members` only after they opt in on the join form ("List me in the member directory"). Nothing is listed automatically.

To publish an opted-in member:

1. Add a photo under `assets/members/` (square JPEG/PNG works best).
2. Append an object to `members.json` at the repo root:

```json
[
  {
    "name": "Casey",
    "boat": "Dash",
    "location": "San Francisco Bay",
    "x": "shieldsworks",
    "photo": "/assets/members/casey.jpg"
  }
]
```

Fields: `name` (required), `boat`, `location`, `x` (handle without @), `photo` (site path; omit to show an initial avatar). Keep the file a JSON array. Commit and push; Vercel deploys `main`.

## Fill in later

1. Add the join-form checkbox “List me in the member directory” if it is not already there.
2. Real meetup entries.
3. Append opted-in members to `members.json` (see above).

## Local preview

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/
```

## License

Site code: all rights reserved unless noted. Omarchy marks © their owners; used per the public brand kit for community / complementary use. Yacht Club sail mark is club artwork.
