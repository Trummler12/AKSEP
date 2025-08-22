module.exports = function(eleventyConfig) {
  return {
    templateFormats: ["html", "md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: 'src',
      includes: 'templates',
      output: '_site'
    }
  };
};
