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
python3 -m http.server 8080
# open http://127.0.0.1:8080/
```

## License

Site code: all rights reserved unless noted. Omarchy marks © their owners; used per the public brand kit for community / complementary use. Yacht Club sail mark is club artwork.
