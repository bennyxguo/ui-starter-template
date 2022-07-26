module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting"),
    require("postcss-nested")({
      bubble: ["screen"],
    }),
    require("tailwindcss")("./src/utilities/themed/tailwind.config.js"),
    require("autoprefixer"),
  ],
};
