# Deploy to Cloudflare Pages

This site is a static Astro app. Cloudflare Pages builds `dist/` on every push.

## One-time setup

1. Push this repo to GitHub (if not already):
  ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/portfolio-2026.git
   git push -u origin main
  ```
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repository and use these build settings:

  | Setting                | Value           |
  | ---------------------- | --------------- |
  | Framework preset       | Astro           |
  | Build command          | `npm run build` |
  | Build output directory | `dist`          |
  | Node.js version        | `22+`           |

4. Add environment variables (Settings → Environment variables):

  | Name             | Value          | Notes                                       |
  | ---------------- | -------------- | ------------------------------------------- |
  | `PUBLIC_GTM_ID`  | `GTM-XXXXXXXX` | Google Tag Manager container (if using GTM) |
  | `PUBLIC_GA_ID`   | `G-XXXXXXXXXX` | GA4 measurement ID (only if not using GTM)    |
  | `OPENAI_API_KEY` | *(optional)*   | Enables semantic search embeddings at build |

  Use **either** `PUBLIC_GTM_ID` or `PUBLIC_GA_ID`, not both — loading both double-counts visits.
  If using GTM, add your GA4 tag inside the GTM container (Tags → GA4 Configuration).

### Homepage project search in GA4 (via GTM)

The homepage search field (`#project-search`) sends GA4’s recommended **`search`** event with parameter **`search_term`** (debounced while typing, immediate on Enter or suggestion tags). With **GTM only**, the site pushes to `dataLayer`; you must wire that in the container once:

1. **Variables** → New → **Data Layer Variable**
   - `search_term`, `search_source` (optional), `search_location` (optional)
2. **Triggers** → New → **Custom Event** → Event name: `search`
3. **Tags** → New → **Google Analytics: GA4 Event**
   - Configuration Tag: your GA4 Configuration tag
   - Event name: `search`
   - Event parameters: `search_term` = `{{DLV - search_term}}` (add others if you created them)
4. **Submit** and **Publish** the container.

**View queries in GA4**

- **Reports → Engagement → Events** → open the **`search`** row → parameter **`search_term`**
- Or **Explore → Free form**: dimension **Event name** (filter `search`) + **search_term**, metric **Event count**

Use **Tag Assistant** or GTM **Preview** on the live site: type in the search box, pause ~1s, confirm a `search` hit with the term you typed.

5. Deploy. Your site will be live at `https://<project-name>.pages.dev`.

## Custom domain

After the first deploy: **Pages project → Custom domains → Set up a custom domain**.

## Local commands

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # outputs dist/
npm run preview      # serve dist/ locally
npm run localize:assets   # download Webflow CDN images to public/assets/
npm run build:search      # regenerate semantic search embeddings
```

