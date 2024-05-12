import { z, defineCollection } from 'astro:content';


const notesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    links: z.array(z.string()),
    backlinks: z.array(z.string()),
    // slug: z.string(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'notes': notesCollection,
};
