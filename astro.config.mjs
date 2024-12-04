import { defineConfig } from 'astro/config';
import rehypeMathjax from 'rehype-mathjax';
import remarkMath from 'remark-math';
import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
    shikiConfig: {
        // Choose from Shiki's built-in themes (or add your own)
        // https://shiki.style/themes
        theme: 'github-light',
        // Enable word wrap to prevent horizontal scrolling
        wrap: true,
      },
  },
  integrations: [svelte(), tailwind()]
});
