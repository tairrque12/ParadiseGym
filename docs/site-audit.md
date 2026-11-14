# Paradise Gym site audit

**Date:** 14 November 2026
**Site:** [paradisegymofficial.com](https://www.paradisegymofficial.com/) (Vercel project `paradise-gym`)
**Scope:** Audit only. No product code was changed.
**Reviewed:** current `main`, a local production build (`next build` + `next start`), and the live HTML for `/`, `/mcallen`, and `/gallery`.

The owner’s conversion goal, used as the lens for this audit:

1. **Primary action:** book a gym tour.
2. **Next action:** buy a membership online.
3. **Positioning:** Paradise Gym should read as one of the best gyms in the area. Premium and credible, not generic.

Screenshots from the local production build are in [`docs/audit/screenshots/`](audit/screenshots/). Desktop is 1440×900. Mobile is 390×844.

## Verdict

The floor photos are the best thing on the site. The page around them argues the wrong sale, in the wrong order, with proof that is not real.

The filled green button everywhere is **Request Membership**, which leaves the site for ABC Fitness. **Free Gym Tour** is the outline button, and on McAllen it is missing from the page entirely. Hours, address, and price sit below a long amenities block and four placeholder reviews. Those reviews are marked in source as demo copy and are already on the live site. The “posing room” photo is a mascot in the mirror room. The “spacious locker rooms” photo is one restroom. McAllen’s “founding” prices are the same three Harlingen prices.

Fix the funnel and the false proof before a visual redesign. A sleeker layout on top of placeholder quotes and an inverted call to action will not raise tour bookings.

## What the site is

| Route | Role |
| --- | --- |
| `/` | Harlingen landing page. One scrolling page: hero, stats, amenities, pricing, reviews, hours. |
| `/mcallen` | McAllen pre-sale. Reuses Harlingen amenities, reviews, and the Harlingen floor photo. |
| `/gallery` | Five floor photos and a footer. No tour or join button in the page body. |
| `POST /api/tour-request` | Saves a tour lead to Supabase `tour_requests` and emails the owner via Resend. |
| `POST /api/membership-request` | Same pattern for `membership_requests`. Nothing in the UI calls it. |

There is no class schedule, trainer page, FAQ, blog, account, or on-site payment. Online join is two ABC Fitness URLs (`src/lib/locations.ts`): club `32265` (Harlingen) and club `32367` (McAllen). Content lives in `src/lib/` (`contact.ts`, `locations.ts`, `membership-options.ts`, `reviews.ts`, `gallery.ts`). Styling is Tailwind with a carbon `#0A0A0A` / neon `#39FF14` theme, Anton + Space Grotesk, and shadcn/Base UI primitives. Motion is Framer Motion.

Production and this repo match on the copy that matters: the same titles, the same “Request Membership” labeling, ABC links, and the names Marcus T., Elena R., Jordan K., and Priya M. in the live homepage HTML.

## Funnel, scored against tour then membership

```text
Arrive
  → understand the gym, where it is, when it is open, what it costs
  → book a tour          (primary)
  → buy a membership     (next, ABC Fitness)
```

What the interface actually does:

| Surface | What is visually primary | Tour |
| --- | --- | --- |
| Desktop header | Neon **Request Membership** | Text button **Free Tour** |
| Mobile header | Nothing. Location switcher and a McAllen banner. | Hidden in the menu, under the membership button |
| Harlingen hero | Neon **Request Membership** | Outline **Free Gym Tour** |
| Harlingen pricing | Every row says **Join Now** and leaves for ABC | No tour prompt |
| McAllen hero | **Lock In Founding Member Pricing** | None. Second button is **View Pre-Sale Pricing** |
| McAllen desktop header | **Founding Membership** (`headerCtaLabel` in `Navbar.tsx`) | Text button **Free Tour**, which books a Harlingen-hours tour with no location stored |
| Gallery | Header membership button only | Header text button only. Page body ends at the footer |
| Footer | Phone number | No tour, no join |

The tour modal itself (`src/components/modals/tour-request-modal.tsx`) is the healthiest part of the funnel. It is short, labels are tied to fields, date and time are optional, and time slots follow Harlingen hours. Native email validation fires. Production Vercel has `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NOTIFICATION_EMAIL` set for production and preview (names only; values were not read). A completed booking was not submitted.

Problems that sit between a visitor and a booked tour:

1. **The primary button sells the second step.** “Request Membership” also mislabels the destination. It is not a request. It opens `onlinejoin.abcfitness.com` in a new tab. The unused in-site membership form (`src/app/api/membership-request/route.ts`, `src/lib/validations/membership.ts`) is the old “request” flow. The label survived the switch to ABC.
2. **Tour is not in the navigation.** Nav items are Amenities, Gallery, Pricing, Reviews, Hours (`src/lib/sections.ts`). Booking a tour is not one of them.
3. **Key facts arrive late.** Address, hours, and phone are in the footer and in Hours, which is the last section, under reviews. The hero has a tagline and two buttons. It does not say Harlingen, 5am–midnight, from $39.99, or that a tour is free and is the way to see the floor.
4. **Pricing does not hand people to a tour.** Six plans, including a $17.99 day pass, all say Join Now. There is no “Not ready to join? Book a tour.” The day pass and week pass are the honest try-before-you-commit products, and they look like the other rows.
5. **Every plan opens the same ABC URL.** `joinLink` is the club signup, not a plan. The visitor picks a price here and picks again on ABC. `src/components/sections/Pricing.tsx`.
6. **“See the front desk” fights online join.** `PRICING_FOOTER_NOTE` in `src/lib/membership-options.ts` is “Please see front desk for current enrollment details.” Enrollment fee, tax amount, and contract terms are not on the page. The discount line says teachers, veterans, and first responders “receive discounts” and does not say how much.
7. **The tour form does not say which gym.** There is no location field. Slots come from Harlingen hours in `src/lib/gym-hours.ts`. The header **Free Tour** button is on the McAllen page too, so a McAllen visitor can book a Harlingen-hours tour that is stored with no location.
8. **McAllen skips the tour and does not show a founding discount.** Hero CTAs are join and “view pricing” (`src/components/sections/McAllenHero.tsx`). The three prices are the Harlingen 12-month ($39.99/mo), month-to-month ($49.99/mo), and paid-in-full ($499.99) options. Nothing on the page is cheaper than the open gym. “Lock in founding member pricing” needs a real difference, or different wording.
9. **Success is easy to miss.** After a good submit the modal says “Tour Requested” and closes itself after 1.5 seconds (`SUCCESS_CLOSE_DELAY_MS`). No visitor confirmation email is sent. Only the owner is notified.
10. **Nothing records either conversion.** See [Analytics](#h-analytics-and-conversion-tracking).

Credible “best gym in the area” proof that is missing, and that a tour-first page needs:

- A Google rating, review count, or link to the Google Business profile.
- Real member words, with full names or a Google attribution. Not initials.
- The actual mark in `public/images/paradise-gym-logo.png`. The header draws a “PG” box in `src/components/Logo.tsx` and never uses that file.
- One plain sentence of what the room is: square footage, the kind of equipment, sauna and posing room included, hours, address. The photos already show a serious floor. The copy does not name it.

## Screenshots

| Page | Desktop | Mobile |
| --- | --- | --- |
| Harlingen | [full page](audit/screenshots/home-desktop.png) | [full page](audit/screenshots/home-mobile.png) |
| McAllen | [full page](audit/screenshots/mcallen-desktop.png) | [full page](audit/screenshots/mcallen-mobile.png) |
| Gallery | [full page](audit/screenshots/gallery-desktop.png) | [full page](audit/screenshots/gallery-mobile.png) |

Funnel details:

- [Desktop hero](audit/screenshots/home-desktop-hero.png) and [mobile hero](audit/screenshots/home-mobile-hero.png). Membership is the green button.
- [Mobile menu](audit/screenshots/home-mobile-menu.png). Same order. No address, hours, or phone.
- [Tour modal](audit/screenshots/home-desktop-tour-modal.png) and [email validation](audit/screenshots/home-desktop-tour-validation.png).
- [Pricing](audit/screenshots/home-desktop-pricing.png). No recommended plan, no tour.
- [Reviews](audit/screenshots/home-desktop-reviews.png). These four quotes are fixtures.
- [Amenities](audit/screenshots/home-desktop-amenities.png). Showers lead. The photo does not match the caption.
- [McAllen hero](audit/screenshots/mcallen-mobile-hero.png). No tour. Opening date is “coming soon.”

## Prioritized findings

### P0 — Do these before any redesign

**1. Swap the primary action to the tour.**
Hero, header, and mobile menu should lead with “Book a free tour.” Membership becomes the second button: “Join online,” with a visible hint that it opens ABC Fitness. Add the same pair under pricing and at the end of the gallery. Add a sticky mobile bar with the tour button. The current mobile header has no action until the menu opens.

**2. Take the placeholder reviews off the live site.**
`src/lib/reviews.ts` opens with `PLACEHOLDER: Demo testimonials — replace with real member reviews before launch.` `src/components/sections/Reviews.tsx` repeats that comment. The four quotes are all five stars, first name plus initial, and written in the same voice:

> “Finally a gym that feels built for serious lifters. The machines are dialed in and the floor never feels crowded.” — Marcus T.

> “I came for aesthetics prep and stayed for the vibe. Sauna after leg day is non-negotiable now.” — Elena R.

> “Traveled from Brownsville just to train here. Worth every mile — custom equipment you cannot find anywhere else.” — Jordan K.

> “Clean, dark, focused. No distractions, no gimmicks. Just a premium space to put in work.” — Priya M.

They also render on `/mcallen`, which is not open. Publishing invented members is the fastest way to look like the opposite of a premium gym. Remove the section until there are real Google reviews, then quote those and link to the profile.

**3. Make the photos match the claims.**
- Posing room, `public/images/posing-room.png`, used in `src/components/sections/Amenities.tsx`. The alt text says “Dedicated posing room with mirrors.” The subject is a Chick-fil-A cow mascot. Replace the file. Keep the room.
- Showers copy: “Spacious locker rooms with premium showers — rinse off and head out feeling fresh after every session.” The photo is a single toilet and shower under a green ceiling light. Say what is actually there, or shoot the locker room if one exists.
- Equipment copy says “Custom-Built Equipment” and “Built In-House” (`src/lib/contact.ts`, `GYM_STATS`). The floor and dumbbell photos show Premier-branded equipment. Confirm the claim with the owner. If the machines are Premier, say Premier. “Built in-house” next to a brand name on the dumbbells reads as made up.
- McAllen uses the Harlingen floor, sauna, shower, and posing photos with no caption saying they are Harlingen. A pre-sale page can show the sister gym. It has to say so.

**4. Put the answer above the fold.**
One tight block under the name: Harlingen, 6201 FM 106 Unit 16A, Mon–Fri 5am–midnight, Sat 8am–8pm, Sun 9am–5pm, sauna and posing room included, memberships from $39.99/mo, day pass $17.99. Then the tour button. Phone `956-990-5277` belongs in the header, not only the footer (`src/lib/contact.ts`, `src/components/sections/Footer.tsx`).

**5. Stop calling identical prices a founding deal.**
Either show a real pre-sale price, or say these are today’s Harlingen rates locked in for McAllen members and name the date they change. “Official Grand Opening Date — Coming Soon” (`src/lib/locations.ts`) is not enough to ask someone to pay for a year.

### P1 — Navigation and the rest of the funnel

**Nav links ignore the page you are on.**
`NAV_LINKS` always point at `/#amenities`, `/#pricing`, `/#reviews`, `/#hours`. `handleSectionNavClick` in `src/lib/section-nav.ts` only scrolls when `pathname === '/'`. On `/mcallen`, Pricing leaves the pre-sale page and opens Harlingen pricing. McAllen has its own `#pricing`. Same for amenities, reviews, and hours. Gallery correctly leaves for those sections, and then offers no tour in the page.

**The header is doing three jobs at once.**
A McAllen announcement (`src/components/LocationAnnouncement.tsx`), a Harlingen/McAllen switcher, section links, a tour button, and a membership button. On a phone the announcement plus the switcher sit on top of the photo, and both actions are behind the hamburger. Desktop nav only appears at `xl` (1280px), so a tablet gets the phone menu (`DESKTOP_NAV_QUERY` in `src/components/sections/Navbar.tsx`).

**Anchor offset is a fixed 160px.**
Sections use `scroll-mt-40`. The header measures itself into `--header-height` and the mobile sheet uses that variable. The in-page links do not. A tall mobile header can cover the heading you just jumped to.

**`#tour` is an empty div.**
`src/components/sections/HoursLocation.tsx` renders `<div id="tour" aria-hidden />`. Nothing links to it. The tour is a modal, which is fine, but the id suggests a section that was removed.

**Tour form friction, smaller than the labeling problem.**
Four required fields (first name, last name, email, phone) is acceptable. A weekday offers a slot every 30 minutes from 5:00 AM to 11:30 PM, which is a long closed `<select>` if someone opens it. There is no note of how soon the gym calls back, how long a tour takes, or that it is free beyond the title. The API has no rate limit or honeypot (`src/lib/api/tour-request.ts`). A failed save returns “Something went wrong. Please try again.” and does not say whether the lead was stored.

**Online membership friction, once the tour has done its job.**
Keep ABC as the checkout. Change the button to “Join online.” Pass the plan through if ABC supports it, so the row they tapped is the plan they see. Publish the enrollment fee and what “+ tax” means, or remove the front-desk sentence. State the 12-month commitment in one line. Point the day pass and week pass at people who want to train before they tour, and point everyone else at the tour.

### (a) Copy and sections to cut or rewrite

The visual system (black room, one green, big condensed type) fits a gym. The writing and the chrome on top of it are the template layer: eyebrow label, giant heading, numbered rows, grain overlay, count-up stats, staggered quotes.

Cut or replace:

| Copy | Where | Why |
| --- | --- | --- |
| “Where Strength Meets Aesthetics” | `src/components/sections/Hero.tsx`, also the default `<title>` in `src/app/layout.tsx` | Slogan with no fact. The title tag should say Harlingen gym, not a tagline. |
| “The Rio Grande Valley's premium training floor — built for lifters who demand more from their gym.” | `src/components/sections/Footer.tsx` | Same pattern. Replace with address, hours, and what is included. |
| “7,500 sq ft of custom-built equipment, neon-lit training space, and a floor built for lifters who show up to work.” | `src/components/sections/Gallery.tsx` | Repeats the slogan. The photos can carry this page. Add a tour button instead. |
| Eyebrows: “Member Perks”, “Join The Floor”, “Member Voices”, “Visit Us”, “Inside Paradise”, “Founding Members” | Amenities, Pricing, Reviews, Hours, Gallery, McAllen pricing | Labels that don’t add information. “Hours & Location” does not need “Visit Us” above it. |
| Giant `01` `02` `03` and the repeated “Included in Membership” | `src/components/sections/Amenities.tsx` | Decoration. Lead with the training floor, then sauna and posing room. Showers are not the differentiator, and they are currently item 01. |
| Count-up “7500 / 70+ / Custom-Built Equipment” | `src/components/sections/GymFacts.tsx`, `src/lib/contact.ts` | The numbers are fine. The animation and the “Built In-House” line are not. One row of facts is enough if the claims are true. |
| Grain overlay on every section | `src/components/motion.tsx` `GrainOverlay` | Noise on top of already dark photos. |
| The whole reviews section, until quotes are real | `src/components/sections/Reviews.tsx` | See P0. |
| “Recover faster with infrared heat…” / “optimal lighting for check-ins, progress pics, and prep” | Amenities | Usable, slightly padded. One sentence each is enough once the photos are right. |

Keep, and move up:

- The real hours and the address.
- The six prices, once each row has an honest button.
- Sauna included, no add-on fee. That is a concrete offer.
- Phone, Instagram, TikTok.

There is no class schedule because the product on the site is open gym, not a class timetable. Say that in the hours block (“Open gym. No class signup.”) if that is true, so “schedule” is not a missing page.

### (b) Navigation and information architecture

Three pages is the right number. The problem is what the nav calls a page.

Proposed order for Harlingen, top to bottom:

1. Hero: name, one factual line, tour first, join second, hours and address.
2. The floor: two or three real photos and what the equipment actually is.
3. Included: sauna, posing room, showers. Short.
4. Pricing, with a tour link under it.
5. Real reviews, or nothing.
6. Map and hours, for people who already decided to come.

Gallery can stay, as proof, with a tour button at the bottom. It should not be a required step.

McAllen should not reuse the Harlingen story wholesale. It needs: this is a second location, it is not open, here is the date or the fact that the date is unset, here is the actual founding offer, here are Harlingen photos labeled as Harlingen, and here is how to tour the open gym or how to hold a membership.

### (c) Conversion blockers

Covered in the funnel section. The short list, in order:

1. Tour is the secondary button.
2. Fake reviews and mismatched photos destroy trust before the modal opens.
3. Price, hours, and address are too far down, and the founding offer is not a different price.
4. Join Now does not carry the plan, and the front-desk line contradicts checkout.
5. Tour leads are not tied to a location, and the success state disappears.
6. No measurement of either action.

Trust signals that are already real and underused: the floor photography, a staffed phone number, posted hours that run to midnight on weekdays, a $17.99 day pass, and saunas included. Those belong next to the tour button.

### (d) Performance

Measured with Lighthouse 13.6.0 against local `next start` on 14 November 2026. Mobile runs use Lighthouse’s simulated mobile throttling. Desktop runs use the desktop preset. This is lab data on localhost, not Vercel field data. CLS is 0 on every run.

| Page | Form | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Mobile | 100 | 93 | 96 | 100 | 0.8 s | 0.8 s | 0 ms | 0 |
| `/` | Desktop | 100 | 93 | 96 | 100 | 0.2 s | 0.2 s | 0 ms | 0 |
| `/mcallen` | Mobile | 94 | 93 | 96 | 100 | 0.8 s | 3.1 s | 0 ms | 0 |
| `/mcallen` | Desktop | 100 | 92 | 96 | 100 | 0.4 s | 0.7 s | 0 ms | 0 |
| `/gallery` | Mobile | 92 | 96 | 96 | 100 | 0.8 s | 3.3 s | 0 ms | 0 |
| `/gallery` | Desktop | 100 | 96 | 96 | 100 | 0.2 s | 0.7 s | 0 ms | 0 |

How to read that:

- Home mobile LCP is the `<h1>` (“Paradise Gym”), not the photo. The hero image is dark, so the white wordmark paints as the largest element. A fast LCP here does not mean the photo is sharp.
- McAllen mobile LCP is the hero `<img>`. It is `fetchpriority="high"` and not lazy. The 3.1 s figure is the simulated number. The unthrottled breakdown on localhost was about 120 ms, so production will depend on the image weight from Vercel’s optimizer.
- Gallery mobile LCP is the first photo, and it is `loading="lazy"` (`src/components/sections/Gallery.tsx`). Lighthouse flags that directly. Resource load in the breakdown was 452 ms before simulation, and the simulated LCP is 3.3 s. Give the first gallery image `priority` and do not lazy-load it.
- Best-practices 96 on every page is one console error: `GET /_vercel/insights/script.js` 404. That route exists on Vercel, not on `next start`. It is not a production outage.
- SEO 100 only means this page has a title, a meta description, a viewport, and alt text. It does not mean local SEO is in good shape. See [SEO](#f-seo-and-local-seo).
- `next build` reports First Load JS of **187 kB for `/`**, 182 kB for `/mcallen`, and 180 kB for `/gallery` (shared 87.3 kB). Lighthouse estimates 56 KiB of unused JavaScript on the homepage. Most of the rest is React plus client components. Hero, navbar, amenities, gallery, hours, and the motion wrappers are all `'use client'` because of Framer Motion, the modal, and the menu. A marketing page does not need scroll-linked parallax (`useScroll` in `Hero.tsx`), staggered fade-ins, and a count-up to be fast. Dropping that motion is the realistic JS cut.
- Hero source `public/images/hero-gym-floor.png` is a **768×1024 JPEG** with a `.png` name. The optimizer will not invent pixels past 768 on the long side, so a desktop hero is an upscale of a phone-sized file. `gallery/gym-overview.png` is the same file (identical checksum). The other amenity and gallery files are the same class of JPEG, roughly 770–1024 px on the long side, 80–200 KB each. Total `public/images` is about 1.3 MB. They are small because they are undersized, not because they are well encoded.
- Requesting `/images/hero-gym-floor.png` directly returns `Content-Type: image/png` for JPEG bytes. `next/image` sniffs the bytes and still serves JPEG. Rename them to `.jpg` so anything that trusts the extension is right.
- A Google Maps iframe loads on Harlingen and McAllen (`HoursLocation.tsx`). It is lazy, below the fold, and not the LCP. It is still a third-party request on every visit to that section. A static map image plus the directions link would be lighter. The directions button is already there.
- `npm audit` reports 2 critical and 18 high. The criticals are in `next@14.2.35` (including image-optimizer advisories that matter when untrusted SVG or AVIF is optimized; this site only optimizes its own JPEGs) and in transitive `proxy-addr`. Most high findings are the dev toolchain (`eslint` 8, `vite`, the `shadcn` CLI package). Upgrade Next on the redesign pass. Do not treat the audit count as “the site is down.”

### (e) Accessibility

What Lighthouse failed, and what it did not:

- **Contrast, confirmed.** Footer copyright uses `text-white/40` (`src/components/sections/Footer.tsx`). Computed `#6c6c6c` on `#0a0a0a` is **3.77:1**. Normal 12px text needs 4.5:1. The same utility is the “Join Now” micro-label at `text-white/35` and several `text-white/45` lines at 10–12 px. Those are hard to read even where they scrape past a ratio. Neon `#39FF14` on carbon is bright enough. The failure is the dim gray, not the green.
- **Contrast, McAllen Join Now buttons.** Lighthouse reported **1.09:1**, foreground `#0a0a0a` on sampled background `#061a02`, for the `bg-neon` label in `McAllenPricing.tsx`. The intended fill is `#39FF14`, which would pass. The sampled background is nearly black. Recheck after the fade/grain layers are simplified. Do not ship that button if the fill is not actually painting.
- **Star widgets.** `src/components/sections/Reviews.tsx` puts `aria-label="5 stars"` on a `<div>` with no role. Lighthouse: `aria-prohibited-attr`. Use a `<span role="img">` or text. This goes away if the fake reviews go away.
- **Tour dialog.** Labels, `aria-invalid`, and a title are in place. Focus handling comes from Base UI. The success message is not in a live region, and the dialog then closes itself.
- **Mobile menu is `modal={false}`** (`Navbar.tsx`). The sheet is visual, but the dialog is not modal, so focus is not trapped and the page behind is not inert.
- **No skip link.** The first control is the McAllen announcement.
- **Gallery has no `<h1>`.** The visible heading “The Gym” is an `<h2>` (`Gallery.tsx`). Home and McAllen each have one `<h1>`.
- **Alt text is present** on the content images, which is why the image-alt audit passed. The posing-room alt describes a room and not the mascot in it.
- **Reduced motion is respected** in the motion helpers and the count-up. That part is in good shape.
- **Hours are a real table** with row headers. The map iframe has a title. Those are fine.

### (f) SEO and local SEO

Lighthouse SEO is 100 because the minimum tags exist. Local discovery is thin.

Present:

- Home title and description in `src/app/layout.tsx`: “Paradise Gym | Where Strength Meets Aesthetics” and a Harlingen description that mentions 7,500 sq ft, saunas, and a posing room.
- McAllen overrides the title and description in `src/app/mcallen/page.tsx`. Good.
- One `<h1>` on home and McAllen. Lang is `en`. Images have alt text. The address and phone are in the HTML, so they can be crawled.
- `favicon.ico` only.

Missing:

- **Gallery metadata.** `/gallery` inherits the home title and the home description. Confirmed on the live URL.
- **Canonical URL, Open Graph, Twitter card, and a share image.** Nothing in `metadata` beyond title and description. A shared link is a gray browser card.
- **`robots.txt` and `sitemap.xml`.** Both are 404 on production.
- **JSON-LD.** No `GymOrSportsActivityPlace` / `LocalBusiness` with name, address, phone, hours, geo, and `sameAs` for Instagram and TikTok. The hours are already structured in `src/lib/contact.ts`. This is a small addition and it is the right local-SEO fix.
- **Google Business.** No link, no embedded rating, no map that is the official profile. The embedded map is a search query for the address string.
- **NAP consistency.** Harlingen is “6201 FM 106 UNIT 16A, Harlingen, TX 78550”. Use one capitalization everywhere and match the Google Business profile exactly, including the unit.
- **Title pattern.** Prefer “Paradise Gym Harlingen | Open Gym, Sauna, Day Pass” over the tagline. McAllen’s title is closer to the mark.
- **Heading on gallery,** as above.
- **Internal links.** The homepage does not link to `/gallery` in the body, only in the nav. McAllen content is reached from the banner and the switcher.

There is no blog and there does not need to be one for this goal.

### (g) Code quality and tech debt

The app is small and the tests are real (Vitest around pricing, hours, tours, nav, plus Playwright). The debt is leftover product, not a mess of folders.

Dead or unused, safe to remove once the redesign starts:

- **Membership request UI is gone, the API is not.** `src/app/api/membership-request/route.ts`, `src/lib/api/membership-request.ts`, `src/lib/validations/membership.ts`, email helpers, and `supabase/migrations/20260702000001_membership_requests.sql`. Join goes to ABC. Keeping the route means a public POST still accepts leads the site no longer collects.
- **`getMembershipSelectLabel`** exists for a select that is no longer rendered.
- **UI primitives with no app imports:** `src/components/ui/badge.tsx`, `card.tsx`, `select.tsx`. `button.tsx` is only used by the dialog close button.
- **Dependencies that the app does not import:** `shadcn` (the CLI, listed under `dependencies`) and `tw-animate-css`. `neon-pulse` in `tailwind.config.ts` is unused.
- **Assets:** `public/images/hero-placeholder.jpg` (a black frame), `public/images/sauna-placeholder.jpg`, `src/app/fonts/GeistVF.woff` and `GeistMonoVF.woff`. Layout uses `next/font` for Anton and Space Grotesk. The README still describes the create-next-app Geist starter.
- **Logo file** `public/images/paradise-gym-logo.png` is unused. The component invents a monogram.
- **Duplicate photo** `hero-gym-floor.png` and `gallery/gym-overview.png`.
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** is set on Vercel and is not referenced. The server uses the service role, which is the right key for these inserts. The anon key can be removed from the project if nothing else needs it.
- **Personal Gmail fallback** in `src/lib/email/resend.ts`: `process.env.NOTIFICATION_EMAIL || 'Paradisegym2025@gmail.com'`. The address was removed from the public site. It should not remain as a hardcoded recipient. `NOTIFICATION_EMAIL` is already set on Vercel.
- **Pricing presentation is two components** (`Pricing.tsx` and `McAllenPricing.tsx`) over one price list. Fine for now. Don’t add a third.
- **`formatFieldsHtml` / `formatFieldsText`** in `src/lib/email/templates.ts` are marked backward-compatible. Check tests before deleting.
- **Zod 4** is in range for a memory-exhaustion advisory on oversized collections (`<4.6.6`). The tour and membership POSTs have no body-size cap.

`scroll-mt` versus `--header-height`, and nav hashes that always mean Harlingen, are behavior bugs, not just cleanup. They are in section (b).

### (h) Analytics and conversion tracking

`@vercel/analytics` is mounted once, in `src/app/layout.tsx`. There are no `track()` calls. A search of `src/` finds no gtag, Google Tag Manager, Meta pixel, or call tracking.

So today, after a deploy, Vercel can show page views. It cannot show:

- tour modal opened
- tour submitted, or tour failed
- join link clicked, and which plan and which club
- phone tapped
- directions tapped
- location switcher used

The 404 for `/_vercel/insights/script.js` in local Lighthouse is expected. Production serves that script. The gap is events, not the pageview snippet.

Minimum events to add with the CTA change: `tour_open`, `tour_submit`, `membership_click` (with `location` and `plan`), `phone_click`. Confirm in the Vercel Analytics dashboard that page views are arriving before adding more tools. A second analytics suite is not required for this.

## Leftover branches

Compared with `origin/main` on 14 November 2026.

### `cursor/enable-vercel-analytics-75dd` — do not merge

The only commit on the branch, `9230b31` (“Add Vercel Web Analytics to the root layout”), is the same patch already on main as `2498f6f` / PR **#2**. `src/app/layout.tsx` and `package.json` match. Git does not see the branch as an ancestor because #2 was squash-merged, so a merge is not a no-op: the branch is behind the header redesign and a merge would have to reconcile that. Close the branch. The feature it shipped is pageviews only. The conversion events in section (h) are still unbuilt. That work should be a new change, not this branch.

### `cursor/remove-personal-email-ead8` — do not merge

The branch tip is an ancestor of main. `91ef992` (“Remove public email from site contact info”) is already on main. The public footer no longer shows an email. Close the branch.

The removal is still incomplete in one place: the Resend helper falls back to `Paradisegym2025@gmail.com` when `NOTIFICATION_EMAIL` is unset (`src/lib/email/resend.ts`). That is a small follow-up on main, not a reason to revive this branch.

### `cursor/update-harlingen-pricing-fd26` — do not merge

The pricing update is already on main. PR **#1** (`332cc82`) brought it in. The branch’s only commit that is not an ancestor, `44920c1` (“Preserve updates to historical memberships”), has the same patch id as main’s `92ff63a`. Current Harlingen prices in `src/lib/membership-options.ts` are the prices this work was for ($39.99 / $49.99 / $499.99 and the day, week, and month passes).

The branch tip is 16 commits behind main. Checking that tree out would put back the in-site membership modal, put the Gmail address back in `src/lib/contact.ts`, and drop the McAllen page, the location switcher, and the current header. Close it. Do not ship it.

## Implementation plan

Effort is the size of the change, not a calendar estimate. Phase 1 is the set that should land before a visual redesign. Phase 2 is the redesign, after the parallel design critique picks a direction.

### Phase 1 — Quick wins

| Item | Effort | Notes |
| --- | --- | --- |
| Make “Book a free tour” the filled button in the hero, header, and mobile menu. Membership becomes “Join online” and says it opens ABC. | Small | Copy and button order in `Hero.tsx`, `Navbar.tsx`, `NeonButton` usage. |
| Sticky mobile tour bar, and a tour button under pricing and under the gallery. | Small | New thin component. Don’t build a second modal. |
| Remove the reviews section until quotes are real. Delete or hide `TESTIMONIALS`. | Small | Tests in `landing-page` and `mcallen` assert on this section. Update them in the same change. |
| Replace the posing-room photo. Rewrite the shower caption to match the photo, or replace the photo. | Small | Asset swap plus two strings in `Amenities.tsx`. |
| Stop saying “built in-house” unless the owner confirms it. Name the equipment that is on the floor. | Small | `GYM_STATS`, gallery intro, amenities. |
| Hero fact line: city, hours, from-price, address. Phone in the header. | Small | Data is already in `contact.ts`. |
| McAllen: label photos as the Harlingen gym, add a tour of Harlingen, and either show a real founding price or stop calling it one. | Medium | `McAllenHero.tsx`, `McAllenPricing.tsx`, `locations.ts`. Needs the owner’s price and date. |
| Nav: on McAllen, Amenities / Pricing / Reviews / Hours scroll the McAllen page. Add “Book a tour” as an action, not a fake section. | Medium | `sections.ts`, `section-nav.ts`, navbar tests. |
| Tour form: record `location`, say which gym the tour is for, keep the success state on screen. | Small | Schema, API insert, modal copy. Supabase column if `tour_requests` has no location. |
| Track `tour_open`, `tour_submit`, `membership_click`, `phone_click`. | Small | `track()` from `@vercel/analytics`. Include `location` and `plan`. |
| JSON-LD `GymOrSportsActivityPlace` for Harlingen, unique gallery title and description, `sitemap.xml`, `robots.txt`, canonical and Open Graph image from a real floor photo. | Medium | App router `metadata` and one or two route files. |
| Footer contrast (`text-white/40` and the 10px grays). Star `aria` fix if reviews stay for any length of time. | Small | |
| Close the three leftover branches. Remove the hardcoded Gmail fallback. | Small | Branch closes are a Git host action. The fallback is one line in `resend.ts`. |
| Rename JPEGs that are named `.png`. Mark the first gallery image `priority`. | Small | Update `gallery.ts` paths and imports. |

Phase 1 does not need a new layout. It changes what the current layout asks people to do, and it removes the claims that are not true.

### Phase 2 — Redesign

Do this after the design critique. The target shape is in section (b), not a new set of sections.

| Item | Effort | Notes |
| --- | --- | --- |
| Rebuild the Harlingen page in the order: answer, floor, included amenities, price, proof, map. One tour action repeated, one join action. | Large | Replaces the stack in `src/app/page.tsx`. Keep the data modules. |
| Shoot or export real photos at desktop width (at least 2000 px on the long side), as JPEG or WebP, including the logo, a true posing room, and the sauna. Drop duplicates and placeholders. | Medium | This is the LCP and the credibility fix together. |
| McAllen as its own pre-sale page, not a Harlingen clone with the city name swapped. | Medium | Depends on opening date and founding price. |
| Delete Framer Motion scroll effects, the grain overlay, and the count-up. Keep reduced-motion behavior by having less motion. | Medium | This is the JS and CLS insurance. Re-run Lighthouse after. |
| Delete the membership-request route, unused UI files, unused dependencies (`shadcn` CLI, `tw-animate-css`), Geist files, and the stale README. | Medium | Confirm no external client posts to `/api/membership-request` first. |
| Plan-specific ABC links, published enrollment fee, and a one-line contract note. | Medium | Needs ABC’s URL shape and the owner’s fee. |
| Upgrade Next.js past the 14.2.35 advisory range and recheck `npm audit`. | Medium | Do it on its own change, with the existing Vitest and Playwright runs. |
| Google Business link and, if the owner wants it, a reviews embed that is actually Google’s. | Small once the profile URL is known | Replaces the invented quotes. |

### What not to do

- Don’t merge the three open branches.
- Don’t add a blog, a class schedule, or a chatbot to look more complete.
- Don’t keep a reviews section “so the page doesn’t feel empty.”
- Don’t redesign the neon-on-black look until the tour is the primary action and the photos tell the truth. The design critique can change the look. It should not bring the filler sections back.

## Method

- Read the App Router pages, section components, content modules, both API routes, Supabase and Resend wiring, and the Playwright and Vitest coverage.
- Production build on this commit. `next build` route table and chunk sizes are the bundle numbers above.
- Chrome screenshots of `/`, `/mcallen`, and `/gallery` at 1440×900 and 390×844, plus the tour modal, mobile menu, pricing, reviews, and amenities.
- Lighthouse 13.6.0, six runs, categories performance, accessibility, best practices, and SEO.
- Live HTML fetched from `https://www.paradisegymofficial.com/` for `/`, `/mcallen`, `/gallery`, `robots.txt`, and `sitemap.xml`.
- Vercel env **names** for `paradise-gym` were listed to see whether tour email and storage are configured. Values were not decrypted. No tour was submitted.
- Branch comparison: `git log` and `git diff` of the three named branches against `origin/main`, plus patch-id comparison for the analytics and pricing commits.
