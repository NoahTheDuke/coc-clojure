const esbuild = require("esbuild");

async function start(plugins) {
	const opts = {
		entryPoints: ["src/index.ts"],
		bundle: true,
		minify: process.env.NODE_ENV === "production",
		sourcemap: process.env.NODE_ENV === "development",
		mainFields: ["module", "main"],
		external: ["coc.nvim"],
		platform: "node",
		target: "node14",
		outfile: "lib/index.js",
		plugins,
	};
	if (plugins) {
		const ctx = await esbuild.context(opts);
		await ctx.watch();
	} else {
		await esbuild.build(opts);
	}
}

let plugins = [];
if (process.argv.length > 2 && process.argv[2] === "--watch") {
	console.log("watching...");
	plugins.push({
		name: "watcher",
		setup(b) {
			let counter = 0;
			b.onEnd((result) => {
				console.log(`watch build #${counter++} succeeded`);
			});
		},
	});
}

start(plugins).catch((e) => {
	console.error(e);
});
