# GitHub Actions Workflows

## Instagram Token Auto-Refresh

The `refresh-instagram-token.yml` workflow automatically refreshes the Instagram long-lived access token before it expires.

### Schedule

- **Runs:** Every Sunday at 3:30 AM EST (8:30 AM UTC)
- **Why Sunday:** Lowest traffic time, gives a full week before next run if issues occur
- **Why 3:30 AM:** Minimal site usage, deployment completes before morning traffic

### What It Does

1. Calls Instagram's token refresh API
2. Updates the `INSTAGRAM_ACCESS_TOKEN` in Vercel environment variables
3. Updates the GitHub secret (so the workflow can use the new token next time)
4. Triggers a Vercel production deployment to apply the new token

### Required GitHub Secrets

You need to add these secrets to your GitHub repository:

| Secret Name | Description | How to Get It |
|-------------|-------------|---------------|
| `INSTAGRAM_ACCESS_TOKEN` | Current Instagram token | Already have this in `.env.local` |
| `VERCEL_TOKEN` | Vercel API token | [Create at Vercel](https://vercel.com/account/tokens) |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Vercel Dashboard → Project → Settings → General |
| `VERCEL_TEAM_ID` | Your Vercel team ID | Vercel Dashboard → Team Settings (optional if personal account) |
| `VERCEL_ENV_VAR_ID` | ID of the env var in Vercel | See instructions below |

### Getting the VERCEL_ENV_VAR_ID

Run this command (replace placeholders):

```bash
curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/YOUR_PROJECT_ID/env" | jq '.envs[] | select(.key=="INSTAGRAM_ACCESS_TOKEN") | .id'
```

Or via the Vercel Dashboard:
1. Go to Project → Settings → Environment Variables
2. Open browser DevTools (F12) → Network tab
3. Click on the INSTAGRAM_ACCESS_TOKEN variable
4. Look for the API request and find the `id` field in the response

### Manual Trigger

You can manually run this workflow anytime:
1. Go to GitHub → Actions → "Refresh Instagram Token"
2. Click "Run workflow"
3. Optionally check "Force refresh" to bypass any checks

### Monitoring

- Check the Actions tab for workflow run history
- Each run creates a summary with expiration dates
- Failed runs will show errors in the workflow logs

### Troubleshooting

**Token refresh fails with 400:**
- Token may already be expired (60+ days)
- Need to generate a new token manually from Meta Developer Console

**Vercel update fails:**
- Check that VERCEL_TOKEN has correct permissions
- Verify VERCEL_ENV_VAR_ID is correct
- If using a team, ensure VERCEL_TEAM_ID is set

**Redeploy fails:**
- The env var is already updated, just manually redeploy from Vercel Dashboard
- Check that the Vercel token has deployment permissions
