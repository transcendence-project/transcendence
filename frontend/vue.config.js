const { defineConfig } = require('@vue/cli-service')
const webpack = require("webpack");

module.exports = defineConfig({
  configureWebpack: {
      entry: "./src/main.ts",
      plugins: [
        new webpack.DefinePlugin({
          // Vue CLI is in maintenance mode, and probably won't merge my PR to fix this in their tooling
          // https://github.com/vuejs/vue-cli/pull/7443
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
        })
      ],
      devServer: {
          hot: true,
      },
      watch: true,
      watchOptions: {
          ignored: /node_modules/,
          poll: 1000,
      },
  },
  transpileDependencies: true,
});