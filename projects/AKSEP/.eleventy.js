module.exports = function(eleventyConfig) {
  return {
    templateFormats: ["html", "md", "njk"],
    dir: {
      input: 'src',
      includes: 'templates',
      output: '_site'
    }
  };
};