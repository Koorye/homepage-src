// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import mdx from "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/node_modules/@mdx-js/rollup/index.js";
import remarkMath from "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/node_modules/remark-math/index.js";
import remarkGfm from "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/node_modules/remark-gfm/index.js";
import rehypeKatex from "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/node_modules/rehype-katex/index.js";
import rehypeMathjax from "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/node_modules/rehype-mathjax/svg.js";
var __vite_injected_original_import_meta_url = "file:///C:/Codes/Koorye.github.io/src/proj/Inspire/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    mdx({
      jsxImportSource: "vue",
      remarkPlugins: [
        remarkMath,
        remarkGfm
      ],
      rehypePlugins: [
        rehypeKatex
        // rehypeMathjax,
      ]
    })
  ],
  base: "/proj/Inspire/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb2Rlc1xcXFxLb29yeWUuZ2l0aHViLmlvXFxcXHNyY1xcXFxwcm9qXFxcXEluc3BpcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENvZGVzXFxcXEtvb3J5ZS5naXRodWIuaW9cXFxcc3JjXFxcXHByb2pcXFxcSW5zcGlyZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovQ29kZXMvS29vcnllLmdpdGh1Yi5pby9zcmMvcHJvai9JbnNwaXJlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuXHJcbmltcG9ydCBtZHggZnJvbSAnQG1keC1qcy9yb2xsdXAnXHJcbmltcG9ydCByZW1hcmtNYXRoIGZyb20gJ3JlbWFyay1tYXRoJztcclxuaW1wb3J0IHJlbWFya0dmbSBmcm9tICdyZW1hcmstZ2ZtJztcclxuaW1wb3J0IHJlaHlwZUthdGV4IGZyb20gJ3JlaHlwZS1rYXRleCc7XHJcbmltcG9ydCByZWh5cGVNYXRoamF4IGZyb20gJ3JlaHlwZS1tYXRoamF4JztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBtZHgoe1xyXG4gICAgICBqc3hJbXBvcnRTb3VyY2U6ICd2dWUnLFxyXG4gICAgICByZW1hcmtQbHVnaW5zOiBbXHJcbiAgICAgICAgcmVtYXJrTWF0aCxcclxuICAgICAgICByZW1hcmtHZm0sXHJcbiAgICAgIF0sXHJcbiAgICAgIHJlaHlwZVBsdWdpbnM6IFtcclxuICAgICAgICByZWh5cGVLYXRleCxcclxuICAgICAgICAvLyByZWh5cGVNYXRoamF4LFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBiYXNlOicvcHJvai9JbnNwaXJlLycsXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH1cclxuICB9LFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRULFNBQVMsZUFBZSxXQUFXO0FBRS9WLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUVoQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBVDZLLElBQU0sMkNBQTJDO0FBWXhQLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUNGLGlCQUFpQjtBQUFBLE1BQ2pCLGVBQWU7QUFBQSxRQUNiO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNiO0FBQUE7QUFBQSxNQUVGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsTUFBSztBQUFBLEVBQ0wsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
