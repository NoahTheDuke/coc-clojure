// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { workspace } from "coc.nvim";

export interface Config {
	enable: boolean;
	executable: string;
	executableArgs: string[] | undefined;
	startupMessage: boolean;
	initializationOptions: Record<string, unknown>;
}

export function getConfig(): Config {
	const config = workspace.getConfiguration("clojure");
	return {
		enable: config.get("enable", true),
		executable: config.get("executable", "clojure-lsp"),
		executableArgs: config.get("executableArgs"),
		startupMessage: config.get("startup-message", false),
		initializationOptions: config.get("initialization-options"),
	};
}
