// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ExtensionContext, services, StatusBarItem, window, workspace } from "coc.nvim";
import { createClient } from "./client";
import { createCommands } from "./commands";
import {getConfig} from "./config";

export async function activate(context: ExtensionContext): Promise<void> {
	const config = getConfig();
	if (!config.enable) return;

	let statusItem: StatusBarItem;
	if (config.startupMessage) {
		statusItem = window.createStatusBarItem(undefined, { progress: true });
		statusItem.text = `Loading clojure-lsp`;
		statusItem.show();
	}

	const client = createClient(config);

	context.subscriptions.push(services.registLanguageClient(client));

	createCommands(context, client);

	if (config.startupMessage) {
		await client.onReady();
		statusItem?.dispose();
		window.showMessage("clojure-lsp loaded!");
	}
}

