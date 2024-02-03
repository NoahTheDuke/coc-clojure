// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ExtensionContext, languages, services, StatusBarItem, window } from "coc.nvim";
import { createClient } from "./client";
import { registerCommands } from "./commands";
import { config, documentSelector } from "./config";
import { findOrDownloadClojureLsp } from "./download/download";
import { logger, setLogger } from "./logger";
import { ClojureSignatureHelpProvider } from "./signature";

export async function activate(context: ExtensionContext): Promise<void> {
	setLogger(context);

	logger.info("Starting up coc-clojure");
	if (!config().enable) return;

	let statusItem: StatusBarItem | null = null;
	if (config().startupMessage) {
		statusItem = window.createStatusBarItem(undefined, { progress: true });
		statusItem.text = "Loading clojure-lsp";
		statusItem.show();
	}

	const clojureLspPath = await findOrDownloadClojureLsp(context);
	if (!clojureLspPath) {
		logger.error("No clojure-lsp installed");
		statusItem?.dispose();
		return;
	}

	const client = createClient(clojureLspPath);
	if (!client) {
		logger.error("clojure-lsp did not initialize");
		statusItem?.dispose();
		return;
	}

	context.subscriptions.push(services.registLanguageClient(client));

	context.subscriptions.push(
		languages.registerSignatureHelpProvider(
			documentSelector,
			new ClojureSignatureHelpProvider(client),
			["(", " "],
		),
	);

	registerCommands(context, client);

	await client.onReady();

	if (config().startupMessage) {
		statusItem?.dispose();
		window.showInformationMessage("clojure-lsp loaded!");
	}
}
