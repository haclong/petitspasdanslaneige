const baseUrl = process.env.BASE_URL || "http://localhost:8080" ;

const testValue = process.env.BASE_URL ;

module.exports = function (eleventyConfig) {
  
	eleventyConfig.addGlobalData("baseUrl", baseUrl) ;  

	eleventyConfig.addGlobalData("testValue", testValue) ;  

	eleventyConfig.addLayoutAlias("postTemplate", "src/_includes/post.njk") ;  

    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/css");
  
  return {
    dir: {
	  input: "src",
	  output: "_site",
	  includes: "_includes",
	  data: "_data",
	},
//	dataTemplateEngine: "", // transforming /data files into JSON
	markdownTemplateEngine: "njk", // transforming markdown files into html
//	htmlTemplateEngine: "", // transforming html files into html
//    templateFormats: ["md"] // list of format that should be transformed
  };
};
