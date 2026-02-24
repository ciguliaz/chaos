# Chaos Protocol — Publishing Plan

## Publishing Strategy: Start Free, Scale Up

```
FREE ──────────────> REVENUE ──────────────> FULL RELEASE
itch.io              CrazyGames/Poki        Steam / App Stores
GitHub Pages         Ad revenue             Paid ($3-5)
```

---

## Phase 1: Free Browser Release (v0.1–v0.3)

### Platforms
| Platform | Cost | Action |
|---|---|---|
| **itch.io** | Free | Upload HTML5 build, "pay what you want" |
| **GitHub Pages** | Free | Host playable demo, link from README |
| **Newgrounds** | Free | Upload for built-in gamer audience |
| **GameJolt** | Free | Additional indie exposure |

### Goals
- Get real players to try the game
- Collect feedback (what's fun, what's confusing)
- Build an initial community
- Generate screenshots/GIFs for marketing

### How to Publish on itch.io
1. Create an account at [itch.io](https://itch.io)
2. `npm run build` → creates a `dist/` folder
3. Zip the `dist/` folder
4. Create a new project → upload the zip → set "Kind of project" to "HTML"
5. Set to "pay what you want" (free with optional donation)
6. Add screenshots, description, tags

---

## Phase 2: Web Game Portals (v0.4+)

### Platforms with Revenue Sharing
| Platform | Revenue Model | How to Submit |
|---|---|---|
| **CrazyGames** | Ad revenue share (they pay YOU per play) | [Submit via developer portal](https://developer.crazygames.com) |
| **Poki** | Ad revenue share | [Apply as developer](https://developers.poki.com) |
| **Kongregate** | Ad revenue share | Submit via their portal |
| **Armor Games** | Sponsorship or rev share | Submit game for review |

### Expected Revenue
- A decent HTML5 game on CrazyGames can earn **$500–$5,000/month**
- Depends heavily on retention and session length
- More layers/content = longer sessions = more ad impressions = more money

### Requirements
- Game must load fast (< 3 seconds)
- Must work on mobile
- No external ads (they insert their own)
- Family-friendly content preferred
- CrazyGames SDK integration for analytics

---

## Phase 3: Steam Release (v1.0)

### Prerequisites
- [ ] Register on [Steamworks](https://partner.steampowered.com/) ($100 one-time fee)
- [ ] Wrap the game in **Tauri** or **Electron** for desktop
  - Tauri preferred: smaller binary, better performance
  - `npm install @tauri-apps/cli` → build for Windows/Mac/Linux
- [ ] Create Steam store page assets:
  - [ ] Capsule images (header, small capsule, hero)
  - [ ] Screenshots (at least 5)
  - [ ] Trailer video (30–60 seconds)
  - [ ] Description and tags
- [ ] Set up Steam achievements (map from in-game achievements)
- [ ] Set up Steam Cloud Save
- [ ] Demo available on Steam (use v0.3 as the demo)

### Pricing
- **$3–5 USD** — sweet spot for indie browser-style games
- Launch with a **10–15% launch discount** to drive wishlists
- Consider regional pricing (Steam handles this automatically)

### Timeline
1. Create store page **3–6 months before launch** (for wishlist accumulation)
2. Share store page link everywhere
3. Target **1,000 wishlists** before launch (this triggers Steam algorithm help)
4. Launch during a relevant Steam sale event if possible

---

## Phase 4: Mobile Release (Future)

### Platforms
| Platform | Cost | Notes |
|---|---|---|
| **Google Play** | $25 one-time | Android APK via Capacitor/PWA |
| **Apple App Store** | $99/year | iOS build via Capacitor |

### Mobile Considerations
- The game is already touch-friendly if built properly
- Use **Capacitor** to wrap the HTML5 game as native app
- Monetization: free-to-play with rewarded ads between matches
- Or: $1.99 one-time purchase (no ads)

---

## Publishing Checklist

### Before Any Release
- [ ] Game runs smoothly at 60fps
- [ ] No console errors
- [ ] Touch controls work on mobile
- [ ] Loading time < 3 seconds
- [ ] Favicon and page title set
- [ ] OpenGraph meta tags (for social media link previews)

### For itch.io
- [ ] 3+ screenshots showing gameplay chaos
- [ ] Short description (1–2 sentences, hooks the reader)
- [ ] Long description (features, how to play, what makes it unique)
- [ ] Cover image (630x500)
- [ ] Tags: chess, roguelite, strategy, browser, chaotic, minesweeper, mashup

### For Steam
- [ ] All store page assets created
- [ ] Trailer uploaded
- [ ] At least 10 Steam achievements
- [ ] Cloud save working
- [ ] Desktop build tested on Windows/Mac/Linux
- [ ] Coming Soon page live 3+ months before launch
