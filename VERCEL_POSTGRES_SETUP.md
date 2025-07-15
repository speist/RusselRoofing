# Vercel Postgres Setup Guide

This guide will walk you through setting up a Vercel Postgres database for your Campaign Tracker project.

## Prerequisites
- A Vercel account (free tier is fine)
- Your project should be connected to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Create a Vercel Project (if not already done)

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Click "Deploy" (you can deploy with default settings for now)

## Step 2: Create a Vercel Postgres Database

1. **Navigate to Storage**
   - In your Vercel dashboard, click on your project
   - Click on the "Storage" tab in the top navigation

2. **Create Database**
   - Click "Create Database"
   - Select "Postgres" from the options
   - Choose a database name (e.g., "campaign-tracker-db")
   - Select your preferred region (choose one close to your users)
   - Click "Create"

3. **Wait for Provisioning**
   - The database creation takes about 30-60 seconds
   - You'll see a success message when it's ready

## Step 3: Get Your Database Credentials

1. **Access Database Dashboard**
   - After creation, you'll be taken to your database dashboard
   - If not, go to Storage → click on your database name

2. **Copy Environment Variables**
   - Click on the ".env.local" tab
   - You'll see something like this:
   ```
   POSTGRES_URL="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NO_SSL="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_URL_NON_POOLING="postgres://default:xxxxx@xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_USER="default"
   POSTGRES_HOST="xxx-xxx-xxx.us-east-1.postgres.vercel-storage.com"
   POSTGRES_PASSWORD="xxxxx"
   POSTGRES_DATABASE="verceldb"
   ```

3. **Copy All Variables**
   - Click "Copy Snippet" or manually copy all the variables

## Step 4: Set Up Local Environment

1. **Create .env.local file**
   - In your project root, create a new file called `.env.local`
   - ⚠️ Make sure it's `.env.local` not `.env.local.example`

2. **Paste Environment Variables**
   - Paste all the copied environment variables into `.env.local`
   - Save the file

3. **Verify .gitignore**
   - Double-check that `.env.local` is in your `.gitignore` file
   - This ensures your database credentials won't be committed to Git

## Step 5: Run Database Migrations

1. **Open Terminal**
   - Open a terminal in your project directory

2. **Run Migration Command**
   ```bash
   npm run db:migrate
   ```

3. **Expected Output**
   You should see output like:
   ```
   🚀 Starting database migration...

   ✅ Migrations table ready
   📋 Found 0 executed migrations
   📁 Found 1 migration files

   🔧 1 pending migrations to run

   🔄 Running migration: 0001_initial_schema.sql
     📝 Executing statement 1/X
     📝 Executing statement 2/X
     ...
   ✅ Migration completed: 0001_initial_schema.sql

   🎉 All migrations completed successfully!
   ```

## Step 6: Verify Database Setup

1. **Check Vercel Dashboard**
   - Go back to your database in Vercel dashboard
   - Click on "Data" tab
   - You should see your tables listed:
     - users
     - campaigns
     - campaign_metrics
     - leads
     - lead_activities
     - _migrations

2. **Connect to Production Database**
   - In Vercel dashboard, go to your project settings
   - Click "Environment Variables"
   - You'll see all the POSTGRES_* variables were automatically added
   - Your production deployment will use these automatically

## Troubleshooting

### "Cannot connect to database" error
- Double-check all environment variables are copied correctly
- Ensure there are no extra spaces or quotes
- Try the connection string in a database client to verify

### "Permission denied" error
- Make sure you're using the correct database name
- Check that the password doesn't have special characters that need escaping

### Migration fails
- Check the Vercel dashboard "Logs" tab for detailed error messages
- Ensure your IP isn't being blocked (Vercel Postgres is accessible from anywhere by default)

## Next Steps

1. **Test Locally**
   ```bash
   npm run dev
   ```
   Your app should now be able to connect to the database

2. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "Add database configuration"
   git push
   ```
   Vercel will automatically deploy with database access

3. **Monitor Usage**
   - Check the "Usage" tab in your database dashboard
   - Free tier includes 60 compute hours/month
   - Storage is limited to 256MB on free tier

## Important Notes

- **Never commit .env.local** to your repository
- **Backup your database** regularly using the Vercel dashboard
- **Connection limits**: Free tier has a limit of 60 connections
- **Automatic SSL**: All connections are automatically SSL encrypted

## Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Postgres Limits](https://vercel.com/docs/storage/vercel-postgres/limits)
- [SQL Editor](https://vercel.com/docs/storage/vercel-postgres/using-the-sql-editor) - Available in the Vercel dashboard for running queries