// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ExtensionContext, languages, services, StatusBarItem, window } from "coc.nvim";
import { createClient } from "./client";
import { registerCommands } from "./commands";
import { documentSelector, getConfig } from "./config";
import { logger, setLogger } from "./logger";
import { ClojureSignatureHelpProvider } from "./signature";

export async function activate(context: ExtensionContext): Promise<void> {
	context.logger.warn("inside coc-clojure");
	const config = getConfig();
	if (!config.enable) return;

	setLogger(context);

	let statusItem: StatusBarItem;
	if (config.startupMessage) {
		logger.info("Showing statusItem");
		statusItem = window.createStatusBarItem(undefined, { progress: true });
		statusItem.text = "Loading clojure-lsp";
		statusItem.show();
	}

	logger.info("Creating client");
	const client = createClient(config);
	context.subscriptions.push(services.registLanguageClient(client));

	context.subscriptions.push(
		languages.registerSignatureHelpProvider(
			documentSelector,
			new ClojureSignatureHelpProvider(client),
			["(", " "]
		)
	);

	registerCommands(context, client);

	await client.onReady();

	if (config.startupMessage) {
		logger.info("Disposing statusItem");
		statusItem?.dispose();
		window.showInformationMessage("clojure-lsp loaded!");
	}
}
