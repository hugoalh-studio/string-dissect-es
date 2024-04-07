import { dirname as pathDirname } from "node:path";
import { transform, type TransformOutput } from "DNT/transform";
import { copy as fsCopy } from "STD/fs/copy.ts";
import { emptyDir } from "STD/fs/empty_dir.ts";
import { ensureDir } from "STD/fs/ensure_dir.ts";
import { walk as readDir, type WalkEntry } from "STD/fs/walk.ts";
const pathsMain: WalkEntry[] = await Array.fromAsync(readDir("."));
const transformResult: TransformOutput = await transform({
	entryPoints: ["mod.ts"],
	mappings: {
		"https://esm.sh/ansi-regex@6.0.1": { name: "ansi-regex" },
		"https://esm.sh/url-regex-safe@4.0.0": { name: "url-regex-safe" }
	},
	shims: [],
	target: "Latest"
});
const npmOutputDir = "npm";
const npmOutputDirDist = `${npmOutputDir}/dist`;
const npmOutputDirSource = `${npmOutputDir}/src`;
await ensureDir(npmOutputDirDist);
await ensureDir(npmOutputDirSource);
await emptyDir(npmOutputDirDist);
await emptyDir(npmOutputDirSource);
for (const { filePath, fileText } of transformResult.main.files) {
	const filePathOutput = `${npmOutputDirSource}/${filePath}`;
	await ensureDir(pathDirname(filePathOutput));
	await Deno.writeTextFile(filePathOutput, fileText);
}
for (const { path } of pathsMain) {
	if (
		/^LICENSE[^\\\/]*\.md$/.test(path) ||
		/^README[^\\\/]*\.md$/.test(path)
	) {
		await fsCopy(path, `${npmOutputDir}/${path}`, {
			overwrite: true,
			preserveTimestamps: true
		});
	}
}
await new Deno.Command("pwsh", {
	args: ["-NonInteractive", "-Command", "$ErrorActionPreference = 'Stop'; npm install; npm run build"],
	cwd: `${Deno.cwd()}/${npmOutputDir}`,
	stderr: "inherit",
	stdin: "inherit",
	stdout: "inherit"
}).output();
