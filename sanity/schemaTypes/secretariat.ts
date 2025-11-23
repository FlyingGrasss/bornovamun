// sanity/schemaTypes/secretariat.ts

import { defineField, defineType } from 'sanity'

export const secretariat = defineType({
  name: 'secretariat',
  title: 'Secretariat',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      type: 'number',
      title: 'Secretariat ID (order)',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Secretariat Name',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Role (e.g. Secretary General)',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'The URL path for this member page',
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
      name: 'bio',
      title: 'Biography',
      type: 'array', 
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'instagram',
      type: 'url',
      title: 'Instagram Link',
    }),
  ]
})