# Vercel Deployment Setup

This guide walks you through setting up automatic deployment to Vercel on every push to `master`.

---

## Step 1: Install Vercel CLI (locally)

```bash
npm i -g vercel
```

## Step 2: Link Your Project

```bash
cd lahore-fashion-store
vercel
```

Follow the prompts:
- Login with your Vercel account
- Link to existing project or create new
- Choose settings (defaults are fine)

## Step 3: Get Your Vercel IDs

After linking, run:

```bash
vercel env ls
```

Or check `.vercel/project.json`:

```bash
cat .vercel/project.json
```

You'll see:
```json
{
  "orgId": "team_xxxxxxxx",
  "projectId": "prj_xxxxxxxx"
}
```

## Step 4: Generate Vercel Token

1. Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Name: `GitHub Actions`
4. Scope: Select your team or personal account
5. Copy the token

## Step 5: Add GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these **5 secrets**:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from Step 4 |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |

## Step 6: Add Environment Variables in Vercel Dashboard

Go to [Vercel Dashboard](https://vercel.com) → Your project → **Settings** → **Environment Variables**

Add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Step 7: Push to Trigger Deploy

```bash
git push origin master
```

GitHub Actions will automatically:
1. Install dependencies
2. Build the project
3. Deploy to Vercel (production on `master`, preview on PRs)

---

## Optional: Manual Deploy

```bash
vercel --prod
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check GitHub Secrets are set correctly |
| Images 404 | Ensure `next.config.ts` has `images.unoptimized: true` |
| Database errors | Verify Supabase URL and keys |
| Admin login fails | Check `ADMIN_PASSWORD` env var |
