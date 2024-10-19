import {
	getMetadataFromConfig,
	invokeDenoNodeJSTransformer
} from "DNT";
const configJSR = await getMetadataFromConfig("jsr.jsonc");
await invokeDenoNodeJSTransformer({
	assetsCopy: [
		"LICENSE.md",
		"README.md"
	],
	entrypoints: configJSR.getExports(),
	generateDeclarationMap: true,
	mappings: {
		"https://esm.sh/ansi-regex@^6.1.0": {
			name: "ansi-regex",
			version: "^6.1.0"

		},
		"https://esm.sh/url-regex-safe@^4.0.0": {
			name: "url-regex-safe",
			version: "^4.0.0"
		}
	},
	metadata: {
		name: configJSR.getName(),
		version: configJSR.getVersion(),
		description: "A module to dissect the string; Safe with the emojis, URLs, and words.",
		keywords: [
			"dissect",
			"string"
		],
		homepage: "https://github.com/hugoalh-studio/string-dissect-es#readme",
		bugs: {
			url: "https://github.com/hugoalh-studio/string-dissect-es/issues"
		},
		license: "MIT",
		author: "hugoalh",
		repository: {
			type: "git",
			url: "git+https://github.com/hugoalh-studio/string-dissect-es.git"
		},
		scripts: {
		},
		engines: {
			node: ">=20.9.0"
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "npm",
	outputDirectoryPreEmpty: true
});
