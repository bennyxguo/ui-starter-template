module.exports = {
  content: [{ raw: "" }],
  corePlugins: {
    preflight: false,
  },
  ampui: {
    base: false,
  },
  plugins: [require("../index")],
};
