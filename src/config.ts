// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { workspace } from "coc.nvim";
import { homedir } from "os";
import { Dictionary } from "./types";

export const documentSelector = [
	{ scheme: "file", language: "clojure" },
	{ scheme: "jar", language: "clojure" },
	{ scheme: "zipfile", language: "clojure" },
];

export interface Keymaps {
	enable: boolean;
	shortcut: string;
}

export interface ClojureConfig {
	checkOnStart: boolean;
	enable: boolean;
	executable: string;
	executableArgs: string[];
	initializationOptions: Dictionary<unknown>;
	keymaps: Keymaps;
	lspInstallPath: string | undefined;
	lspVersion: string;
	startupMessage: boolean;
}

export function config(): ClojureConfig {
	const rawConfig = workspace.getConfiguration("clojure");
	const lspInstallPath = rawConfig.get<string>("lsp-install-path");
	const initializationOptions = {
		...rawConfig.get<Dictionary<any>>("initialization-options", {}),
	};

	for (const [key, val] of Object.entries(initializationOptions)) {
		if (Array.isArray(val) && val.length === 0) {
			delete initializationOptions[key];
		}
	}

	return {
		checkOnStart: rawConfig.get("lsp-check-on-start"),
		keymaps: rawConfig.get("keymaps"),
		enable: rawConfig.get("enable"),
		executable: rawConfig.get("executable"),
		executableArgs:
			rawConfig.get("executable-args", null) ||
			rawConfig.get("executableArgs", null) ||
			[],
		initializationOptions,
		lspVersion: rawConfig.get("lsp-version"),
		lspInstallPath: lspInstallPath?.startsWith("~")
			? lspInstallPath.replace("~", homedir())
			: lspInstallPath,
		startupMessage: rawConfig.get("startup-message"),
	} as ClojureConfig;
}
