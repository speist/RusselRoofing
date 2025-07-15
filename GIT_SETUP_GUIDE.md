# Git Setup Guide - Pushing to Your New Repository

Follow these steps to push your Campaign Tracker project to your new empty repository.

## Step 1: Initialize Git in Your Project

1. **Open Terminal in your project directory**
   ```bash
   cd "/Users/derekwalton/PurpleLab Dropbox/Derek Walton/Mac/Documents/Campaign Tracker"
   ```

2. **Initialize Git** (if not already initialized)
   ```bash
   git init
   ```

## Step 2: Add Your Remote Repository

1. **Get your repository URL**
   - Go to your GitHub/GitLab/Bitbucket repository
   - Click the "Code" button
   - Copy the HTTPS URL (looks like: `https://github.com/yourusername/your-repo-name.git`)

2. **Add the remote**
   ```bash
   git remote add origin YOUR_REPOSITORY_URL
   ```
   Replace `YOUR_REPOSITORY_URL` with the URL you copied

## Step 3: Prepare Your First Commit

1. **Check what will be committed**
   ```bash
   git status
   ```
   
2. **Add all files**
   ```bash
   git add .
   ```

3. **Verify .env.local is NOT being added**
   ```bash
   git status
   ```
   - Make sure you DON'T see `.env.local` in the list
   - You SHOULD see `.env.local.example`
   - If you see `.env.local`, remove it: `git rm --cached .env.local`

4. **Create your first commit**
   ```bash
   git commit -m "Initial commit: Campaign Tracker with Vercel Postgres setup"
   ```

## Step 4: Push to Your Repository

1. **Push to main branch**
   ```bash
   git push -u origin main
   ```
   
   If you get an error about 'main' not existing, try:
   ```bash
   git push -u origin master
   ```

2. **If you get a "rejected" error** (because the remote has a README or LICENSE):
   ```bash
   git pull origin main --allow-unrelated-histories
   git push origin main
   ```

## Step 5: Verify Upload

1. **Check your repository online**
   - Refresh your GitHub/GitLab/Bitbucket page
   - You should see all your files
   - Verify `.env.local` is NOT there
   - Verify `.env.local.example` IS there

## What Should Be in Your Repository

✅ **Should be included:**
- `/app` directory
- `/components` directory  
- `/lib` directory
- `/migrations` directory
- `/scripts` directory
- `/public` directory
- `/style-guide` directory
- `package.json` and `package-lock.json`
- `next.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `.env.local.example`
- `README.md`
- All other configuration files

❌ **Should NOT be included:**
- `/node_modules` directory
- `/.next` directory
- `.env.local` (your actual credentials)
- `.DS_Store` files

## Common Issues

### "Permission denied (publickey)"
You're trying to use SSH but haven't set up SSH keys. Use HTTPS URL instead:
```bash
git remote set-url origin https://github.com/yourusername/your-repo.git
```

### "src refspec main does not match any"
Your default branch might be 'master':
```bash
git branch -M main
git push -u origin main
```

### Large files warning
If you get warnings about large files, make sure `node_modules` is in `.gitignore`

## After Pushing Successfully

Now you can:
1. Go to Vercel.com
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will detect it's a Next.js project
5. Click "Deploy"

The deployment will initially fail because the database isn't set up yet - that's normal! Continue with the database setup steps in VERCEL_POSTGRES_SETUP.md after deploying.