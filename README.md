# strousehouse.co

Personal portfolio site for Lindsay Brielle Strouse. Plain HTML, CSS and JS, hosted on GitHub Pages (same setup as workwell-site). No build step.

## The page

One scrolling page, `index.html`: an opening with heading, short bio and portrait, then "Trusted by" logos, key numbers, services, selected work, bio, speaking and writing, and contact. Styles live in `styles.css`; menu, filters, "Read more", the moving speaking tiles, the London clock and the two easter eggs live in `script.js`.

## Easter eggs

1. Click the logo in the header five times.
2. Type "hey google" anywhere on a page.

## Before launch


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
