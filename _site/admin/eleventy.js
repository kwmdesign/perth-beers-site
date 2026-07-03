module.exports = function (eleventyConfig) {
  // Copy these folders straight through to the built site, untouched.
  // (CSS, JS and images don't need processing — Eleventy just passes them along.)
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Copy the CMS admin folder straight through (both index.html and config.yml).
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  // Don't let Eleventy also template the admin page — passthrough handles it.
  eleventyConfig.ignores.add("src/admin/index.html");

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
