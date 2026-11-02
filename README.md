# strousehouse.co

Personal portfolio site for Lindsay Brielle Strouse. Plain HTML, CSS and JS, hosted on GitHub Pages (same setup as workwell-site). No build step.

## The page

One scrolling page, `index.html`: hero, services, selected work, bio with "Trusted by" logos, speaking and writing, contact. The menu stays pinned at the top and highlights the section you're in. Styles live in `styles.css` (three looks, `theme-a`, `theme-b` and `theme-c`, set on `<body>`; keep the chosen one and delete the other two). Menu, filters, moving tiles and the two easter eggs live in `script.js`.

## Easter eggs

1. Click the logo in the header five times.
2. Type "hey google" anywhere on a page.

## Before launch

- Add links for the three essays in the speaking tiles.

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
