import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // The hosted Studio the RR content team uses: https://russellroofing.sanity.studio
  // Pinned here so `sanity deploy` is non-interactive and self-documenting.
  studioHost: 'russellroofing',
})
