import { dirname as pathDirname } from "node:path";
import { transform, type TransformOutput } from "DNT/transform.ts";
import { copy as fsCopy } from "STD/fs/copy.ts";
import { emptyDir } from "STD/fs/empty_dir.ts";
import { ensureDir } from "STD/fs/ensure_dir.ts";
import { walk as readDir, type WalkEntry } from "STD/fs/walk.ts";
const pathsMain: WalkEntry[] = await Array.fromAsync(readDir("."));
const transformResult: TransformOutput = await transform({
	entryPoints: [
		"mod.ts"
	],
	mappings: {
		"https://esm.sh/ansi-regex@6.0.1": { name: "ansi-regex" },
		"https://esm.sh/url-regex-safe@4.0.0": { name: "url-regex-safe" }
	},
	shims: [],
	target: "Latest"
});
const nodejsOutputDir = "nodejs";
const nodejsOutputDirDist = `${nodejsOutputDir}/dist`;
const nodejsOutputDirSource = `${nodejsOutputDir}/src`;
await ensureDir(nodejsOutputDirDist);
await ensureDir(nodejsOutputDirSource);
await emptyDir(nodejsOutputDirDist);
await emptyDir(nodejsOutputDirSource);
for (const { filePath, fileText } of transformResult.main.files) {
	const filePathOutput = `${nodejsOutputDirSource}/${filePath}`;
	await ensureDir(pathDirname(filePathOutput));
	await Deno.writeTextFile(filePathOutput, fileText);
}
for (const { name } of pathsMain) {
	if (
		/^LICENSE[^\\\/]*\.md$/.test(name) ||
		/^README[^\\\/]*\.md$/.test(name)
	) {
		await fsCopy(name, `${nodejsOutputDir}/${name}`, { overwrite: true, preserveTimestamps: true });
	}
}
await new Deno.Command("pwsh", {
	args: [
		"-NonInteractive",
		"-Command",
		"$ErrorActionPreference = 'Stop'; npm install --ignore-scripts; npm run build"
	],
	cwd: `${Deno.cwd()}/${nodejsOutputDir}`
}).output();
