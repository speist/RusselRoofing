import {defineType, defineField} from 'sanity'

// Fields mirror blog-migration/sanity-blog-import.ndjson so the imported
// posts populate cleanly. Authors edit posts here; the public site reads them.
export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
      description: 'The /news/<slug> part of the URL.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'featuredImageAlt',
      title: 'Featured image alt text',
      type: 'string',
      description: 'Describes the image for accessibility/SEO.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'authorName',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ (optional)',
      description:
        'Optional Q&A shown at the bottom of the post. Also emits FAQ structured data for Google & AI search.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (r) => r.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: (r) => r.required(),
            },
          ],
          preview: {select: {title: 'question'}},
        },
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO meta description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original HubSpot URL (reference)',
      type: 'url',
      readOnly: true,
      description: 'Where this post lived in HubSpot — kept for reference/redirects.',
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest first',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt', media: 'mainImage'},
  },
})
