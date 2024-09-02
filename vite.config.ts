/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import camelCase from "camelcase";
import packageJson from "./package.json";

const packageName = packageJson.name.split("/").pop() || packageJson.name;
const globalName = camelCase(packageName, { pascalCase: true });

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: globalName,
      fileName: packageName,
    },
    rollupOptions: {
      output: {
        globals: {
          globalName: globalName,
        },
      },
    },
    sourcemap: true,
  },
  plugins: [dts({ rollupTypes: true })],
  test: {},
});
