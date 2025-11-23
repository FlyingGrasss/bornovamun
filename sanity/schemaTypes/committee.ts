// sanity/schemaTypes/committee.ts

import { defineField, defineType } from 'sanity'

export const committee = defineType({
  name: 'committee',
  title: 'Committee',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      type: 'number',
      title: 'Committee ID (order)',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Committee Name',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'The URL path for this committee page (e.g. /committees/crisis)',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array', 
      of: [{type: 'block'}]
    }),
    defineField({
        name: 'documents',
        type: 'array',
        title: 'Committee Documents (Study Guides, etc.)',
        of: [
            {
                type: 'file',
                options: { accept: '.pdf,.doc,.docx' },
                fields: [
                    {
                        name: 'title',
                        type: 'string',
                        title: 'Document Title'
                    }
                ]
            }
        ]
    })
  ]
})