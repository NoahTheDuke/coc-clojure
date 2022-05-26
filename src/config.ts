// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { workspace } from "coc.nvim";

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
	executableArgs: string[] | undefined;
	initializationOptions: Record<string, unknown>;
	startupMessage: boolean;
}

export let config: ClojureConfig;

export function setConfig(): void {
	const rawConfig = workspace.getConfiguration("clojure");
	const keymaps = rawConfig.inspect<Keymaps>("keymaps");
	const executable = rawConfig.inspect<string>("executable");
	const enable = rawConfig.inspect<boolean>("enable");
	const executableArgs = rawConfig.inspect<string[] | undefined>("executableArgs");
	const initializationOptions = rawConfig.inspect<Record<string, unknown>>(
		"initializationOptions"
	);
	const startupMessage = rawConfig.inspect<boolean>("startupMessage");
	config = {
		keymaps: {
			enable: rawConfig.get("keymaps.enable", keymaps.defaultValue.enable),
			shortcut: rawConfig.get("keymaps.shortcut", keymaps.defaultValue.shortcut),
		},
		enable: rawConfig.get("enable", enable.defaultValue),
		executable: rawConfig.get("executable", executable.defaultValue),
		executableArgs: rawConfig.get("executableArgs", executableArgs.defaultValue),
		initializationOptions: rawConfig.get(
			"initialization-options",
			initializationOptions.defaultValue
		),
		startupMessage: rawConfig.get("startup-message", startupMessage.defaultValue),
	};
}
