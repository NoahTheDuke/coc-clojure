// Adapted from Calva and coc-rust-analyzer
// * https://github.com/BetterThanTomorrow/calva/blob/a891b25/src/lsp/download.ts
// * https://github.com/BetterThanTomorrow/calva/blob/a891b25/src/utilities.ts
// * https://github.com/fannheyward/coc-rust-analyzer/blob/f9b77dc/src/downloader.ts
// * https://github.com/fannheyward/coc-rust-analyzer/blob/f9b77dc/src/ctx.ts
// Covered by original licenses

import { ExtensionContext, window } from "coc.nvim";
import extractZip from "extract-zip";
import { https } from "follow-redirects";
import fs, { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import path from "path";
import { URL } from "url";
import { config } from "../config";
import { logger } from "../logger";
import {
	getArtifactDownloadName,
	getClojureLspPath,
	getVersionFilePath,
	readVersionFile,
} from "./utilities";

async function fetchFromUrl(fullUrl: string): Promise<string> {
	const url = new URL(fullUrl);
	return new Promise((resolve, reject) => {
		https
			.get(
				{
					host: url.hostname,
					path: url.pathname,
					port: url.port,
					headers: { "user-agent": "node.js" },
				},
				(res) => {
					let data = "";
					res.on("data", (chunk: any) => {
						data += chunk;
					});
					res.on("end", () => {
						resolve(data);
					});
				}
			)
			.on("error", (err: any) => {
				logger.error(`Error downloading file from ${url}: ${err.message}`);
				reject(err);
			});
	});
}

export async function getLatestVersion(): Promise<string> {
	try {
		const releasesJSON = await fetchFromUrl(
			"https://api.github.com/repos/clojure-lsp/clojure-lsp/releases"
		);
		const releases = JSON.parse(releasesJSON);
		return releases[0].tag_name;
	} catch (e: any) {
		logger.error("Error while finding latest clojure-lsp version.", e.message);
		return "";
	}
}

function backupExistingFile(clojureLspPath: string): string {
	const backupDir = path.join(path.dirname(clojureLspPath), "backup");
	const backupPath = path.join(backupDir, path.basename(clojureLspPath));

	try {
		if (!fs.existsSync(backupDir)) {
			fs.mkdirSync(backupDir);
		}
		logger.info("Backing up existing clojure-lsp to", backupPath);
		fs.renameSync(clojureLspPath, backupPath);
	} catch (e: any) {
		logger.error("Error while backing up existing clojure-lsp file.", e.message);
	}

	return backupPath;
}

function downloadArtifact(url: string, filePath: string): Promise<void> {
	logger.info("Downloading clojure-lsp from", url);
	const statusItem = window.createStatusBarItem(0, { progress: true });
	statusItem.show();
	return new Promise((resolve, reject) => {
		https
			.get(url, (response) => {
				if (response.statusCode === 200) {
					const writeStream = fs.createWriteStream(filePath);
					let cur = 0;
					const len = Number(response.headers["content-length"]);
					response
						.on("data", (chunk: Buffer) => {
							cur += chunk.length;
							const p = ((cur / len) * 100).toFixed(2);
							statusItem.text = `${p}% Downloading clojure-lsp`;
						})
						.on("end", () => {
							writeStream.close();
							statusItem.hide();
							logger.info("Clojure-lsp artifact downloaded to", filePath);
							resolve();
						})
						.pipe(writeStream);
				} else {
					response.resume(); // Consume response to free up memory
					statusItem.hide();
					reject(new Error(response.statusMessage));
				}
			})
			.on("error", (...args: any[]) => {
				statusItem.hide();
				return reject(...args);
			});
	});
}

function writeVersionFile(extensionPath: string, version: string): void {
	logger.info("Writing version file");
	const filePath = getVersionFilePath(extensionPath);
	try {
		fs.writeFileSync(filePath, version);
	} catch (e: any) {
		logger.error("Could not write clojure-lsp version file.", e.message);
	}
}

async function unzipFile(zipFilePath: string, extensionPath: string): Promise<void> {
	logger.info("Unzipping file");
	return extractZip(zipFilePath, { dir: extensionPath });
}

export async function downloadClojureLsp(
	extensionPath: string,
	version: string
): Promise<string> {
	const artifactName = getArtifactDownloadName();
	const url =
		version !== "nightly"
			? `https://github.com/clojure-lsp/clojure-lsp/releases/download/${version}/${artifactName}`
			: `https://nightly.link/clojure-lsp/clojure-lsp/workflows/nightly/master/${artifactName}`;
	const downloadPath = path.join(extensionPath, artifactName);
	const clojureLspPath = getClojureLspPath(extensionPath);
	const backupPath = fs.existsSync(clojureLspPath)
		? backupExistingFile(clojureLspPath)
		: clojureLspPath;
	try {
		await downloadArtifact(url, downloadPath);
		if (path.extname(downloadPath) === ".zip") {
			await unzipFile(downloadPath, extensionPath);
		}
		if (path.extname(clojureLspPath) === "") {
			fs.chmodSync(clojureLspPath, 0o775);
		}
		writeVersionFile(extensionPath, version);
	} catch (e: any) {
		logger.error("Error downloading clojure-lsp.", e.message);
		return backupPath;
	}
	return clojureLspPath;
}

function findExisting(extensionPath: string): string | undefined {
	// Does it exist globally?
	{
		let { executable } = config();

		if (executable.startsWith("~/")) {
			executable = executable.replace("~", homedir());
		}

		if (existsSync(executable)) return executable;
	}

	// Did coc-clojure already install it previously?
	{
		let { lspInstallPath } = config();
		let executable: string;

		if (lspInstallPath) {
			if (lspInstallPath.startsWith("~/")) {
				lspInstallPath = lspInstallPath.replace("~", homedir());
			}
			executable = getClojureLspPath(lspInstallPath);
		} else {
			executable = getClojureLspPath(extensionPath);
		}

		if (existsSync(executable)) return executable;
	}
}

// Finds or downloads the clojure-lsp executable, returns the path
export async function findOrDownloadClojureLsp(
	context: ExtensionContext
): Promise<string | undefined> {
	const extensionPath = context.storagePath;
	if (!existsSync(extensionPath)) {
		mkdirSync(extensionPath);
	}
	let bin = findExisting(extensionPath);

	if (bin) return bin;

	const choice = await window.showQuickpick(
		["Yes", "No"],
		"clojure-lsp is not found. Download from Github?"
	);
	if (choice === 0) {
		const currentVersion = readVersionFile(extensionPath);
		const { lspVersion, lspInstallPath } = config();
		const downloadVersion = ["", "latest"].includes(lspVersion)
			? await getLatestVersion()
			: lspVersion;
		if (
			(currentVersion !== downloadVersion && downloadVersion !== "") ||
			downloadVersion === "nightly"
		) {
			let path = lspInstallPath || extensionPath;
			if (path.startsWith("~/")) {
				path = path.replace("~", homedir());
			}
			bin = await downloadClojureLsp(path, downloadVersion);
			logger.info(`Successfully downloaded clojure-lsp to ${bin}`);
		}
	}
	return bin;
}
