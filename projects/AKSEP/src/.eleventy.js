module.exports = function(eleventyConfig) {
  return {
    dir: {
      input: '.',
      includes: 'templates',
      output: '../'
    }
  };
};