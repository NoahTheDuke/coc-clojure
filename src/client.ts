// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { LanguageClient, LanguageClientOptions, ServerOptions } from "coc.nvim";
import path from "path";
import { config, documentSelector } from "./config";
import { logger } from "./logger";

export function createClient(clojureLspPath: string): LanguageClient {
	logger.info("Creating client");

	const executable =
		path.extname(clojureLspPath) === ".jar"
			? {
					command: path.join(process.env.JAVA_HOME!, "bin", "java"),
					args: ["-jar", clojureLspPath],
			  }
			: {
					command: clojureLspPath,
					args: config().executableArgs,
			  };
	logger.debug("ServerOptions", executable);

	const serverOptions: ServerOptions = {
		run: executable,
		debug: executable,
	};
	const clientOptions: LanguageClientOptions = {
		disabledFeatures: ["signatureHelp"],
		documentSelector,
		initializationOptions: config().initializationOptions,
	};
	const client = new LanguageClient(
		"clojure",
		"Clojure Language Client",
		serverOptions,
		clientOptions
	);
	return client;
}
