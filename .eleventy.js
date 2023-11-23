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

	// gestion des drafts
	// ne pas publier le permalink
	eleventyConfig.addGlobalData("eleventyComputed.permalink", function() {
		return (data) => {
			// always skip during non-watch/serve builds
			if(data.draft) {
				return false;
			}

			return data.permalink;
		}
	});
	// gestion des drafts
	// when eleventyExcludeFromCollections is true, the file is not included in any collection
	eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludedFromCollections", function() {
		return (data) => {
			// always exclude from non-watch/serve builds
			if(data.draft) {
				return true;
			}

			return data.eleventyExcludeFromCollections;
		}
	});

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

	eleventyConfig.addFilter("getGlobalData", function(data) {
		return require(`./src/_data/collections/${data}.json`) ;
	});

	eleventyConfig.addCollection("post_fr", function (collection) {
		return collection.getFilteredByGlob("./src/fr/posts/*/*.md");
	});
  
	eleventyConfig.addCollection("post_en", function (collection) {
		return collection.getFilteredByGlob("./src/en/posts/*/*.md");
	});

	eleventyConfig.addCollection("tag_fr", function (collection) {
		let fr_tags = {}
		let posts = collection.getFilteredByGlob("./src/fr/posts/**/*.md");
		for (let post of posts) {
			if (post.data.tags) { 
				for (let tag of post.data.tags) {
					fr_tags[tag] ??= [];
					fr_tags[tag].push(post);
				}
			}
		}

		return fr_tags;
	})

	eleventyConfig.addCollection("tag_en", function (collection) {
		let en_tags = {}
		let posts = collection.getFilteredByGlob("./src/en/posts/**/*.md");
		for (let post of posts) {
			if (post.data.tags) { 
				for (let tag of post.data.tags) {
					en_tags[tag] ??= [];
					en_tags[tag].push(post);
				}
			}
		}

		return en_tags;
	})

	eleventyConfig.addCollection("sites_fr", function (collection) {
		let fr_sites = {}
		let posts = collection.getFilteredByGlob("./src/fr/posts/**/*.md");
		for (let post of posts) {
			if (post.data.sites) { 
				for (let site of post.data.sites) {
					fr_sites[site] ??= [];
					fr_sites[site].push(post);
				}
			}
		}
		let books = collection.getFilteredByGlob("./src/fr/books/*.md");
		for (let book of books) {
			if (book.data.sites) {
				for (let site of book.data.sites) {
					fr_sites[site] ??= [];
					fr_sites[site].push(book);
				}
			}
		}

		return fr_sites;
	})

	eleventyConfig.addCollection("sites_en", function (collection) {
		let en_sites = {}
		let posts = collection.getFilteredByGlob("./src/en/posts/**/*.md");
		for (let post of posts) {
			if (post.data.sites) { 
				for (let site of post.data.sites) {
					en_sites[site] ??= [];
					en_sites[site].push(post);
				}
			}
		}

		return en_sites;
	})

	eleventyConfig.addCollection("book_fr", function (collection) {
		return collection.getFilteredByGlob("./src/fr/books/*.md");
	});
  
	eleventyConfig.addCollection("book_en", function (collection) {
		return collection.getFilteredByGlob("./src/en/books/*.md");
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
