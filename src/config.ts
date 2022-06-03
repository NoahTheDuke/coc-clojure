// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { workspace } from "coc.nvim";
import { Dictionary } from "./types";

export const documentSelector = [
	{ scheme: "file", language: "clojure" },
	{ scheme: "jar", language: "clojure" },
	{ scheme: "zipfile", language: "clojure" },
];

interface Keymaps {
	enable: boolean;
	shortcut: string;
}

export interface ClojureConfig {
	keymaps: Keymaps;
	enable: boolean;
	executable: string;
	executableArgs: string[];
	initializationOptions: Dictionary<unknown>;
	lspVersion: string;
	lspInstallPath: string | undefined;
	startupMessage: boolean;
}

export function config(): ClojureConfig {
	const rawConfig = workspace.getConfiguration("clojure");
	const keymaps = rawConfig.inspect<Keymaps>("keymaps")!;
	const executable = rawConfig.inspect<string>("executable")!;
	const enable = rawConfig.inspect<boolean>("enable")!;
	const initializationOptions = rawConfig.inspect<Dictionary<unknown>>(
		"initializationOptions"
	)!;
	const lspVersion = rawConfig.inspect<string>("lsp-version")!;
	const startupMessage = rawConfig.inspect<boolean>("startupMessage")!;

	return {
		keymaps: {
			enable: rawConfig.get("keymaps.enable", keymaps.defaultValue?.enable),
			shortcut: rawConfig.get("keymaps.shortcut", keymaps.defaultValue?.shortcut),
		},
		enable: rawConfig.get("enable", enable.defaultValue),
		executable: rawConfig.get("executable", executable.defaultValue),
		executableArgs:
			rawConfig.get("executable-args") || rawConfig.get("executableArgs") || [],
		initializationOptions: rawConfig.get(
			"initialization-options",
			initializationOptions.defaultValue
		),
		lspVersion: rawConfig.get("lsp-version", lspVersion.defaultValue),
		lspInstallPath: rawConfig.get("lsp-install-path"),
		startupMessage: rawConfig.get("startup-message", startupMessage.defaultValue),
	} as ClojureConfig;
}
