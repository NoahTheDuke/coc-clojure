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

type CommandParams = (string | number)[];

interface Command {
	command: string;
	title?: string;
	choices?: string[];
	fn?: (client: LanguageClient) => Promise<any>;
}

async function getUriAndPosition(): Promise<CommandParams> {
	const { line, character } = await window.getCursorPosition();
	const document = await workspace.document;
	return [document.uri, line, character];
}

async function getInput(title: string, defaultTitle = ""): Promise<string> {
	const result = (await window.requestInput(title, defaultTitle)).trim();
	return result;
}

async function fetchDocs(client: LanguageClient) {
	const symName = await getInput("Var name?");
	const symNs = await getInput("Namespace?", "clojure.core");
	if (symName && symNs) {
		const result = await client
			.sendRequest<Record<string, string>>("clojure/clojuredocs/raw", {
				symName,
				symNs,
			})
			.catch((error) => {
				window.showErrorMessage(error);
			});
		if (result) {
			await window.showDialog({
				title: `${result.ns}/${result.name}`,
				content: result.doc,
			});
		}
	}
}

const clojureCommands: Command[] = [
	{ command: "add-import-to-namespace", title: "Import name?" },
	{ command: "add-missing-import" },
	{ command: "add-missing-libspec" },
	{ command: "add-require-suggestion" },
	{ command: "change-coll", title: "New coll type", choices: ["list", "vector", "map", "set"] },
	{ command: "clean-ns" },
	{ command: "create-function" },
	{ command: "create-test" },
	{ command: "cycle-coll" },
	{ command: "cycle-privacy" },
	{ command: "expand-let" },
	{ command: "extract-function", title: "Function name?" },
	{ command: "inline-symbol" },
	{ command: "introduce-let", title: "Bind to?" },
	{ command: "move-coll-entry-down" },
	{ command: "move-coll-entry-up" },
	{ command: "move-to-let", title: "Bind to?" },
	{ command: "resolve-macro-as", title: "Function name?" },
	{ command: "sort-map" },
	{ command: "suppress-diagnostic", title: "Lint to ignore?" },
	{ command: "thread-first" },
	{ command: "thread-first-all" },
	{ command: "thread-last" },
	{ command: "thread-last-all" },
	{ command: "unwind-all" },
	{ command: "unwind-thread" },
	{
		command: "docs",
		fn: fetchDocs,
	},
	{
		command: "server-cursor-info",
		fn: async (client) => {
			const [uri, line, character] = await getUriAndPosition();
			return client
				.sendRequest("clojure/cursorInfo/log", {
					textDocument: { uri },
					position: {
						line,
						character,
					},
				})
				.catch((error) => {
					window.showErrorMessage(error);
				});
		},
	},
	{
		command: "server-cursor-info-raw",
		fn: async (client) => {
			const [uri, line, character] = await getUriAndPosition();
			return client
				.sendRequest("clojure/cursorInfo/raw", {
					textDocument: { uri },
					position: {
						line,
						character,
					},
				})
				.catch((error) => {
					window.showErrorMessage(error);
				});
		},
	},
	{
		command: "server-info",
		fn: async (client) => {
			return client.sendRequest("clojure/serverInfo/log").catch((error) => {
				window.showErrorMessage(error);
			});
		},
	},
	{
		command: "server-info-raw",
		fn: async (client) => {
			return client.sendRequest("clojure/serverInfo/raw").catch((error) => {
				window.showErrorMessage(error);
			});
		},
	},
];

async function executePositionCommand(
	client: LanguageClient,
	{ command }: Command,
	extraParams: CommandParams = []
): Promise<any> {
	const position = await getUriAndPosition();
	return client
		.sendRequest("workspace/executeCommand", {
			command,
			arguments: position.concat(extraParams),
		})
		.catch((error) => {
			window.showErrorMessage(error);
		});
}

async function titleWithChoices(title: string, choices: string[]): Promise<string> {
	const result = await window.showMenuPicker(choices, title);
	if (result === -1) return;
	return choices[result];
}

async function executeChoicesCommand(client: LanguageClient, cmd: Command): Promise<any> {
	const { title, choices } = cmd;
	const extraParam = await titleWithChoices(title, choices);
	return executePositionCommand(client, cmd, [extraParam]);
}

async function executePromptCommand(client: LanguageClient, cmd: Command): Promise<any> {
	const { title } = cmd;
	const extraParam = await getInput(title);
	if (extraParam) {
		return executePositionCommand(client, cmd, [extraParam]);
	}
}

function registerCommand(client: LanguageClient, cmd: Command): Disposable {
	const { command, fn, title, choices } = cmd;
	const id = `lsp-clojure-${command}`;

	return commands.registerCommand(id, async () => {
		if (choices && !workspace.env.dialog) {
			return;
		} else if (fn) {
			const { fn } = cmd;
			return fn(client);
		} else if (choices) {
			await executeChoicesCommand(client, cmd);
		} else if (title) {
			await executePromptCommand(client, cmd);
		} else {
			await executePositionCommand(client, cmd);
		}
	});
}

export function registerCommands(context: ExtensionContext, client: LanguageClient): void {
	context.subscriptions.push(...clojureCommands.map((cmd) => registerCommand(client, cmd)));
}
