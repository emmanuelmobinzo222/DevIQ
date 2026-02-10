module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    }
  },
  style: {
    postcss: {
      mode: "extends",
      loaderOptions: {
        postcssOptions: {
          ident: "postcss",
          plugins: [
            require("tailwindcss"),
            require("autoprefixer"),
          ],
        },
      },
    },
  },
};
