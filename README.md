# Omarchy Yacht Club

Public website for **Omarchy Yacht Club** — a community for sailors who run [Omarchy](https://omarchy.org) Linux.

- **Site:** https://omarchyyc.org  
- **Repo:** https://github.com/shieldsworks/omarchyyc  
- **Redirect:** omarchyyachtclub.org → omarchyyc.org (DNS / GoDaddy)

## Stack

Plain static HTML + CSS. No build step. Hosted on Vercel (import this repo at [vercel.com/new](https://vercel.com/new)).

## Branding

Colors and type are complementary to omarchy.org (Tokyo Night / solitude-style tokens):

| Token | Value |
|-------|--------|
| Background | `#1a1b26` |
| Brand | `#9ece6a` |
| Text | `#c0caf5` |
| Sans | Geist |
| Mono | JetBrains Mono |

Assets in `assets/` include the official Omarchy logo and wordmark (from [omarchy.org/brand](https://omarchy.org/brand)) plus the Yacht Club sail mark (`oyc-mark`, `oyc-sheet`).

## Pages

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/meetups` | Meetups (placeholder until dates exist) |
| `/photos` | Gallery placeholders |
| `/merch` | Coming soon |
| `/join` | Membership — embed Google Form when ready |

## Fill in later

1. Google Form embed URL in `join.html` (search for `TODO(casey)`).
2. Uncomment X / Instagram `@omarchyyc` footer links when those accounts exist.
3. Real meetup entries and photo files.

## Local preview

```bash
python3 -m http.server 8080
# open http://127.0.0.1:8080/
```

## License

Site code: all rights reserved unless noted. Omarchy marks © their owners; used per the public brand kit for community / complementary use. Yacht Club sail mark is club artwork.
