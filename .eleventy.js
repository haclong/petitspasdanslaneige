const baseUrl = process.env.BASE_URL || "http://localhost:8080" ;

const testValue = process.env.BASE_URL ;

// on importe le plugin Eleveny Image 
// qui a été installé avec npm install
//const Image = require("@11ty/eleventy-img");
const { EleventyI18nPlugin } = require("@11ty/eleventy");

// on écrit la fonciton qui redimensionne les images du bandeau (homepage)
// async function bandeauShortcode(src, alt, sizes) {
// 	let metadata = await Image(src, {
// 		widths: [300, 600],
// 		formats: ["webp", "jpeg"]
// 	});

// 	let imageAttributes = {
// 		alt,
// 		sizes,
// 		loading: "lazy",
// 		decoding: "async",
// 	};

// 	return Image.generateHTML(metadata, imageAttributes) ;
// }

// async function imageMaxShortcode(src, alt, sizes) {
// 	let metadata = await Image(src, {
// 		widths: [300, 600],
// 		formats: ["webp", "jpeg"]
// 	});

// 	let imageAttributes = {
// 		alt,
// 		sizes,
// 		loading: "lazy",
// 		decoding: "async",
// 	};

// 	return Image.generateHTML(metadata, imageAttributes) ;
// }

module.exports = function (eleventyConfig) {
  
	eleventyConfig.addGlobalData("baseUrl", baseUrl) ;  

	eleventyConfig.addGlobalData("testValue", testValue) ;  

//	eleventyConfig.addLayoutAlias("postTemplate", "src/_includes/post.njk") ;

	eleventyConfig.addPlugin(EleventyI18nPlugin, {
		defaultLanguage: "fr",
	});

    eleventyConfig.addPassthroughCopy("src/img");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");
	eleventyConfig.addPassthroughCopy("src/assets") ;
 
  	// on associe la function bandeauShortcode créé pour redimensionner les iamges
	// avec le shortcode "bandeau" qui va être utilisé dans les templates
//	eleventyConfig.addAsyncShortcode("bandeau", bandeauShortcode);
//	eleventyConfig.addAsyncShortcode("imagemax", imageMaxShortcode);

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	eleventyConfig.addCollection("post_fr", function (collection) {
		return collection.getFilteredByGlob("./src/fr/posts/*/*.md");
	});
  
	eleventyConfig.addCollection("post_en", function (collection) {
		return collection.getFilteredByGlob("./src/en/posts/*/*.md");
	});


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
    templateFormats: ["md", "njk"] // list of format that should be transformed
  };
};
