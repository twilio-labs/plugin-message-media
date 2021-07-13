module.exports = (config, { isProd, isDev, isTest }) => {
  /**
   * Customize the webpack by modifying the config object.
   * Consult https://webpack.js.org/configuration for more information
   */

  config.module.rules.push({
    test: /\.svg/,
    use: {
      loader: "svg-url-loader",
      options: {
        iesafe: true
      }
    }
  });

  return config;
}
