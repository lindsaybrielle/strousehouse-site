# strousehouse.co

Personal portfolio site for Lindsay Brielle Strouse. Plain HTML, CSS and JS, hosted on GitHub Pages (same setup as workwell-site). No build step.

## The page

One scrolling page, `index.html`: an opening with heading, short bio and portrait, then "Trusted by" logos, key numbers, services, selected work, bio, speaking and writing, and contact. Styles live in `styles.css`; menu, filters, "Read more", the moving speaking tiles, and the hidden box breathing pause live in `script.js`.

## Hidden surprise

Click (or tap) anywhere on the page three times, at any pace, as long as each click comes within 2 seconds of the last. The site blurs from the point you clicked and a glass card guides four rounds of box breathing: a dot travels around a square (in 4, hold 4, out 4, hold 4) while the square fills and empties. The footer tells visitors how to find it. Escape, the close button, or a click outside the card ends it any time. Typing "breathe", or linking to strousehouse.co/#breathe, opens it too.

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
