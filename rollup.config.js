import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import alias from "rollup-plugin-alias";

const commonPlugins = [
  typescript(),
  resolve(),
  commonjs(),
  babel({
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    exclude: "node_modules/**",
    presets: [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-typescript"
    ]
  }),
  postcss({
    plugins: [],
    inject: true,
    extract: false,
    minimize: true,
    sourceMap: true
  }),
  json(),
  terser(),
  copy({
    targets: [
      { src: "src/manifest.json", dest: "./tg_web_chat_gpt_helper" },
      { src: "src/assets", dest: "./tg_web_chat_gpt_helper" }
    ]
  })
];

export default [
  {
    input: "src/index.tsx",
    output: {
      dir: "./tg_web_chat_gpt_helper",
      format: "iife",
      sourcemap: true
    },
    plugins: commonPlugins
  },
  {
    input: "src/background.ts",
    output: {
      dir: "./tg_web_chat_gpt_helper",
      format: "iife",
      sourcemap: true
    },
    plugins: [
      ...commonPlugins,
      // Add the following plugin to avoid conflicts with React
      alias({
        resolve: [".tsx", ".ts", ".js"],
        entries: [
          { find: "react", replacement: "preact/compat" },
          { find: "react-dom", replacement: "preact/compat" }
        ]
      })
    ]
  }
];
