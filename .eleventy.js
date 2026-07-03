module.exports = function (eleventyConfig) {
  // Copy these folders straight through to the built site, untouched.
  // (CSS, JS and images don't need processing — Eleventy just passes them along.)
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Also copy the CMS admin folder once it exists (Stage 2).
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  return {
    dir: {
      input: "src",        // where our source lives
      output: "_site",     // where the finished, deployable site is written
      data: "_data"        // folder (inside src) holding beers.json, trail.json
    },
    // Treat .html files as Nunjucks templates too, so our index can use {{ }} loops.
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
