// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {
	commands,
	Disposable,
	ExtensionContext,
	LanguageClient,
	window,
	workspace,
} from "coc.nvim";

async function getUriAndPosition(): Promise<any[]> {
	const { line, character } = await window.getCursorPosition();
	const document = await workspace.document;
	return [document.uri, line, character];
}

interface Command {
	command: string;
	promptTitle?: string;
}

const refactorCommands: Command[] = [
	{ command: "add-import-to-namespace", promptTitle: "Import name?" },
	{ command: "add-missing-libspec" },
	{ command: "clean-ns" },
	{ command: "cycle-coll" },
	{ command: "cycle-privacy" },
	{ command: "expand-let" },
	{ command: "extract-function", promptTitle: "Function name?" },
	{ command: "inline-symbol" },
	{ command: "introduce-let", promptTitle: "Bind to?" },
	{ command: "move-to-let", promptTitle: "Bind to?" },
	{ command: "thread-first" },
	{ command: "thread-first-all" },
	{ command: "thread-last" },
	{ command: "thread-last-all" },
	{ command: "unwind-all" },
	{ command: "unwind-thread" },
];

async function promptForBinding(title: string): Promise<string> {
	const result = await window.requestInput(title, "");
	const trimmed = result.trim();
	return trimmed === "" ? "___ empty input" : trimmed;
}

function registerCommand(client: LanguageClient, cmd: Command): Disposable {
	const { command, promptTitle } = cmd;
	const id = `lsp-clojure-${command}`;

	return commands.registerCommand(id, async () => {
		const extraParam = promptTitle ? await promptForBinding(promptTitle) : null;
		if (extraParam === "___ empty input") {
			return;
		}

		const position = await getUriAndPosition();
		const params = [...position, ...(extraParam || [])];
		client
			.sendRequest("workspace/executeCommand", {
				command,
				arguments: params,
			})
			.catch((error) => {
				window.showErrorMessage(error);
			});
	});
}

export function createCommands(context: ExtensionContext, client: LanguageClient): void {
	context.subscriptions.push(
		commands.registerCommand("lsp-clojure-server-info", async () => {
			return client.sendRequest("clojure/serverInfo/log");
		}),
		commands.registerCommand("lsp-clojure-server-info-raw", async () => {
			return client.sendRequest("clojure/serverInfo/raw");
		}),
		commands.registerCommand("lsp-clojure-cursor-info", async () => {
			return client.sendRequest("workspace/executeCommand", {
				command: "cursor-info",
				arguments: await getUriAndPosition(),
			});
		}),
		...refactorCommands.map((cmd) => registerCommand(client, cmd))
	);
}
