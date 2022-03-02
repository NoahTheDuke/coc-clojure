// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ExtensionContext, services, StatusBarItem, window } from "coc.nvim";
import { createClient } from "./client";
import { registerCommands } from "./commands";
import { getConfig } from "./config";
import { logger, setLogger } from "./logger";

export async function activate(context: ExtensionContext): Promise<void> {
	const config = getConfig();
	if (!config.enable) return;

	setLogger(context);

	let statusItem: StatusBarItem;
	if (config.startupMessage) {
		logger.info("Showing statusItem");
		statusItem = window.createStatusBarItem(undefined, { progress: true });
		statusItem.text = `Loading clojure-lsp`;
		statusItem.show();
	}

	logger.info("Creating client", config);
	const client = createClient(config);

	context.subscriptions.push(services.registLanguageClient(client));
	registerCommands(context, client);

	await client.onReady();

	if (config.startupMessage) {
		logger.info("Disposing statusItem");
		statusItem?.dispose();
		window.showMessage("clojure-lsp loaded!");
	}

	// client.onNotification("clojure/textDocument/testTree", (tree: any) => {
	// 	window.showInformationMessage(JSON.stringify(tree, null, 4));
	// });
}
