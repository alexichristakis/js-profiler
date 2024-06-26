module.exports = {
  devServer: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },

  // Update webpack config to use custom loader for worker files
  webpack: {
    configure: (config) => {
      // Note: It's important that the "worker-loader" gets defined BEFORE the TypeScript loader!
      config.module.rules.unshift({
        test: /\.worker\.ts$/,
        use: {
          loader: "worker-loader",
          options: {
            // Use directory structure & typical names of chunks produces by "react-scripts"
            filename: "static/js/[name].[contenthash:8].js",
          },
        },
      });

      return config;
    },
  },
};
