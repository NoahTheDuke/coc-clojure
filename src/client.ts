// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { LanguageClient, LanguageClientOptions, ServerOptions } from "coc.nvim";
import { Config } from "./config";

export function createClient(config: Config): LanguageClient {
	const executablePath = config.executable;

	const serverOptions: ServerOptions = {
		run: { command: executablePath },
		debug: { command: executablePath },
	};
	const initializationOptions = {
		"use-metadata-for-privacy?": true,
		"ignore-classpath-directories": true,
	};
	const clientOptions: LanguageClientOptions = {
		documentSelector: ["clojure"],
		initializationOptions: Object.assign(initializationOptions, config.initializationOptions),
	};
	return new LanguageClient("clojure", "Clojure Language Client", serverOptions, clientOptions);
}
