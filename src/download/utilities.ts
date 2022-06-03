// Adapted from Calva:
// * https://github.com/BetterThanTomorrow/calva/blob/a891b25/src/lsp/utilities.ts
// Covered by original licenses

import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import { logger } from "../logger";
import { Dictionary } from "../types";

const versionFileName = "clojure-lsp-version";

const artifacts: Dictionary<Dictionary<string>> = {
	darwin: {
		x64: "clojure-lsp-native-macos-amd64.zip",
		// Should M1 Macs use emulated native binary or native standalone jar until M1 native available?
		// arm64: 'clojure-lsp-native-macos-amd64.zip',
	},
	linux: {
		x64: "clojure-lsp-native-static-linux-amd64.zip",
		arm64: "clojure-lsp-native-linux-aarch64.zip",
	},
	win32: {
		x64: "clojure-lsp-native-windows-amd64.zip",
	},
};

export function getArtifactDownloadName(
	platform: string = process.platform,
	arch: string = process.arch
): string {
	return artifacts[platform]?.[arch] ?? "clojure-lsp-standalone.jar";
}

export function getClojureLspPath(
	extensionPath: string,
	platform: string = process.platform,
	arch: string = process.arch
): string {
	let name = getArtifactDownloadName(platform, arch);
	if (path.extname(name).toLowerCase() !== ".jar") {
		name = arch === "win32" ? "clojure-lsp.exe" : "clojure-lsp";
	}
	return path.join(extensionPath, name);
}

export function getVersionFilePath(extensionPath: string): string {
	return path.join(extensionPath, versionFileName);
}

export function readVersionFile(extensionPath: string): string {
	const filePath = getVersionFilePath(extensionPath);
	try {
		const version = fs.readFileSync(filePath, "utf8");
		return version;
	} catch (e: any) {
		logger.error("Could not read clojure-lsp version file.", e.message);
		return "";
	}
}
