// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { LanguageClient, LanguageClientOptions, ServerOptions } from "coc.nvim";
import { Config, documentSelector } from "./config";

export function createClient(config: Config): LanguageClient {
	const executable = {
		command: config.executable,
		args: config.executableArgs,
	};

	const serverOptions: ServerOptions = {
		run: executable,
		debug: executable,
	};
	const clientOptions: LanguageClientOptions = {
		documentSelector,
		initializationOptions: config.initializationOptions,
	};
	return new LanguageClient("clojure", "Clojure Language Client", serverOptions, clientOptions);
}
