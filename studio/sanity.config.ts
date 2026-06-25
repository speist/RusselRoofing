import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

// projectId comes from your Sanity account (see blog-migration/RUNBOOK.md).
// Set it in .env (SANITY_STUDIO_PROJECT_ID=...) — never hard-coded here.
export default defineConfig({
  name: 'default',
  title: 'Russell Roofing Blog',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  schema: {types: schemaTypes},
})
