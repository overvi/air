const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    select: "./src/assets/js/select.js",
    home: "./src/assets/js/home.js",
    tab: "./src/assets/js/tab.js",
    auth: "./src/assets/js/auth.js",
    dropdown: "./src/assets/js/dropdown.js",
    profile: "./src/assets/js/profile.js",
    "search-ticket": "./src/assets/js/search-ticket.js",
    "slider-range": "./src/assets/js/slider-range.js",
    booking: "./src/assets/js/booking.js",
    passengers: "./src/assets/js/passengers.js",
    inlineDatepicker: "./src/assets/js/inlineDatepicker.js",
    paymentlist: "./src/assets/js/paymentlist.js",
    passengerDetails: "./src/assets/js/passengerDetails.js",
    initSelect: "./src/assets/js/initSelect.js",
    blogs : "./src/assets/js/blogs.js"
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        "auth/sign-in/index": "./src/auth/sign-in/index.html",
        "auth/sign-up/index": "./src/auth/sign-up/index.html",
        "auth/password-reset/index": "./src/auth/password-reset/index.html",
        "auth/code/index": "./src/auth/code/index.html",
        "home/index": "./src/home/index.html",
        "user/dashboard/index": "./src/user/dashboard/index.html",
        "user/profile/index": "./src/user/profile/index.html",
        "user/travel-history/index": "./src/user/travel-history/index.html",
        "user/travel-history/1/index": "./src/user/travel-history/1/index.html",
        "booking/one-way/a/index": "./src/booking/one-way/a/index.html",
        "booking/one-way/b/index": "./src/booking/one-way/b/index.html",
        "booking/one-way/confirmation/index":
          "./src/booking/one-way/confirmation/index.html",
        "booking/two-way/a/index": "./src/booking/two-way/a/index.html",
        "booking/two-way/a/other/index": "./src/booking/two-way/a/other/index.html",
        "booking/two-way/b/index": "./src/booking/two-way/b/index.html",
        "booking/two-way/passenger-details/index":
          "./src/booking/two-way/passenger-details/index.html",
        "booking/one-way/passenger-details/index":
          "./src/booking/one-way/passenger-details/index.html",

        "booking/two-way/confirmation/index":
          "./src/booking/two-way/confirmation/index.html",
        "user/passengers/index": "./src/user/passengers/index.html",
        "user/payment-list/index": "./src/user/payment-list/index.html",
        "user/wallet/index": "./src/user/wallet/index.html",
        "user/withdraw-list/index": "./src/user/withdraw-list/index.html",
        "dashboard/index": "./src/dashboard/index.html",
        "agency-signup/index": "./src/agency-signup/index.html",

        "blog/index": "./src/blog/index.html",
        "blog/1/index": "./src/blog/1/index.html",
      },
      js: {
        // output filename of extracted JS from source script loaded in HTML via `<script>` tag
        filename: "js/[name].[contenthash:8].js",
      },
      css: {
        // output filename of extracted CSS from source style loaded in HTML via `<link>` tag
        filename: "css/[name].[contenthash:8].css",
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // Font file extensions
        type: "asset/resource", // Use built-in asset/resource for Webpack 5
        generator: {
          filename: "fonts/[name][ext]", // Output directory for fonts
        },
      },

      {
        test: /\.css$/i,
        use: ["css-loader", "postcss-loader"],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",

        generator: {
          filename: "assets/img/[name].[hash:8][ext]",
        },
      },
    ],
  },
  devServer: {
    static: "./dist",
    hot: true,
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js", ".esm.js"],

    alias: {
      "@assets": path.join(__dirname, "./src/assets"),
    },
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/", // 👈 Ensures correct asset paths
    clean: true, // Clean the output directory before building
  },

  optimization: {
    runtimeChunk: "single",

    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  mode: "development",
};
