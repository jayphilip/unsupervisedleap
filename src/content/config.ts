import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    description: z.string().optional(),
    showToc: z.boolean().default(true),
    hidemeta: z.boolean().default(false),
  }),
});

export const collections = { posts };
