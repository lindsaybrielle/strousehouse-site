# strousehouse.co

Personal portfolio site for Lindsay Brielle Strouse. Plain HTML, CSS and JS, hosted on GitHub Pages (same setup as workwell-site). No build step.

## Pages

- `index.html` – home: positioning, the thread through the work, three ways I help, selected work, ways to work together
- `work.html` – selected work grouped by Insight, Programs and Stories, plus ventures
- `writing-speaking.html` – essays, talks and teaching
- `about.html` – bio and short work history
- `contact.html` – email, Calendly, LinkedIn
- `404.html` – page not found

Shared styles live in `styles.css`; menu, filters and the two easter eggs live in `script.js`. The header and footer are repeated in each page, so change them everywhere if you edit one.

## Easter eggs

1. Click the little house in the header five times.
2. Type "hey google" anywhere on a page.

## Before launch

- Replace the yellow `todo` placeholders on the Writing & Speaking page with real titles, links and summaries.
- Swap in a professional headshot (`assets/img/`) when you have one.

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
