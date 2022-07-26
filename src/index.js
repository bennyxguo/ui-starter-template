/**
 * Structure and code is base on DaisyUI
 * @see
 */

const postcssJs = require("postcss-js");
const postcssPrefix = require("./lib/postcss-prefixer");

const colors = require("./colors/index");
const colorFunctions = require("./colors/functions");
const themes = require("./colors/themes");

const ampuiInfo = require("../package.json");
const base = require("../dist/base");
const utilities = require("../dist/utilities");
const themedUtilities = require("../dist/utilities-themed");
const skeletonUtilities = require("../dist/utilities-skeleton");
const themed = require("../dist/themed");
const skeleton = require("../dist/skeleton");

const pluginFunction = ({ addBase, addComponents, addUtilities, config, postcss }) => {
  let ampuiIncludedItems = [];
  const logs = config("ampui.logs") ?? true;

  if (logs) {
    console.log();
    console.log("\x1b[35m%s\x1b[0m", "❄️ ampUI components " + ampuiInfo.version, "\x1b[0m", ampuiInfo.homepage);
    console.log();
  }

  // inject @base style under "/src/base"
  addBase(base);
  ampuiIncludedItems.push("base");

  // inject components
  let styleFile = themed;
  if (config("ampui.themed") === false) {
    styleFile = skeleton;
    ampuiIncludedItems.push("skeleton only components");
  } else {
    ampuiIncludedItems.push("themed components");
  }

  // add prefix to class names if specified
  const prefix = config("ampui.prefix");
  let postcssJsProcess = null;
  if (prefix) {
    try {
      postcssJsProcess = postcssJs.sync(postcssPrefix({ prefix, ignore: [] }));
    } catch (error) {
      logs && console.error(`Error occurred and prevent applying the "prefix" option:`, error);
    }
  }
  const shouldApplyPrefix = prefix && postcssJsProcess;
  if (shouldApplyPrefix) {
    styleFile = postcssJsProcess(styleFile);
  }

  addComponents(styleFile);

  const themeInjector = colorFunctions.injectThemes(addBase, config, themes);

  ampuiIncludedItems.push("themes[" + themeInjector.themeOrder.length + "]");

  // inject @utilities style needed by components
  if (config("ampui.utils") != false) {
    addComponents(utilities, { variants: ["responsive"] });

    let toAdd = skeletonUtilities;
    if (shouldApplyPrefix) {
      toAdd = postcssJsProcess(toAdd);
    }
    addComponents(toAdd, { variants: ["responsive"] });

    toAdd = themedUtilities;
    if (shouldApplyPrefix) {
      toAdd = postcssJsProcess(toAdd);
    }
    addComponents(toAdd, { variants: ["responsive"] });

    ampuiIncludedItems.push("utilities");
  }

  if (logs) {
    console.log("\x1b[32m%s\x1b[0m", "✔︎ Including:", "\x1b[0m", "" + ampuiIncludedItems.join(", "));
    console.log();
    console.groupEnd();
  }
};

module.exports = require("tailwindcss/plugin")(pluginFunction, {
  theme: { extend: { colors } },
});
