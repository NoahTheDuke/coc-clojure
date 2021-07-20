// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { workspace } from "coc.nvim";

// from calva:
// include the 'file' and 'untitled' to the
// document selector. All other schemes are
// not known and therefore not supported.
export const documentSelector = [
	{ scheme: "file", language: "clojure" },
	{ scheme: "jar", language: "clojure" },
	{ scheme: "untitled", language: "clojure" },
];

export interface Config {
	enable: boolean;
	executable: string;
	executableArgs: string[] | undefined;
	initializationOptions: Record<string, unknown>;
	startupMessage: boolean;
}

export function getConfig(): Config {
	const config = workspace.getConfiguration("clojure");
	return {
		enable: config.get("enable", true),
		executable: config.get("executable", "clojure-lsp"),
		executableArgs: config.get("executableArgs"),
		initializationOptions: config.get("initialization-options"),
		startupMessage: config.get("startup-message", false),
	};
}
