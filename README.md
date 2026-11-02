# strousehouse.co

Personal portfolio site for Lindsay Brielle Strouse. Plain HTML, CSS and JS, hosted on GitHub Pages (same setup as workwell-site). No build step.

## The house

One scrolling page, `index.html`, where each section is a room with its own hand-drawn illustration (inline SVG, roughened by the `#rough` filter):

- Outside, the front door (`#home`): what Strouse House does
- Room 01, the living room (`#what-we-do`): three services as the reading lamp, the kitchen table and the mantelpiece
- Room 02, the studio (`#work`): selected work with filters, plus "out in the shed" ventures
- Room 03, the library (`#speaking`): writing, talks and teaching
- Room 04, who lives here (`#about`): bio, work history, guestbook
- Outside, the porch (`#contact`): email, Calendly, LinkedIn

The menu stays pinned at the top and highlights the room you're in. `404.html` is the "wrong door" page. Styles live in `styles.css`; menu, drawing animations, filters and the two easter eggs live in `script.js`.

## Easter eggs

1. Click the little house in the header five times.
2. Type "hey google" anywhere on a page.

## Before launch

- Replace the yellow `todo` placeholders on the Writing & Speaking page with real titles, links and summaries.

## Connecting strousehouse.co

1. In the repo: Settings → Pages → Source: deploy from branch `main`, folder `/ (root)`. The `CNAME` file already says `strousehouse.co`.
2. At your domain registrar, add these DNS records. Leave your existing MX records alone so email at brielle@strousehouse.co keeps working.

   | Type  | Name | Value |
   |-------|------|-------|
   | A     | @    | 185.199.108.153 |
   | A     | @    | 185.199.109.153 |
   | A     | @    | 185.199.110.153 |
   | A     | @    | 185.199.111.153 |
   | CNAME | www  | lindsaybrielle.github.io |

3. Once GitHub shows the domain as verified, tick "Enforce HTTPS".
