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

type CommandParams = [string, number, number, string?];

async function getUriAndPosition(): Promise<CommandParams> {
	const { line, character } = await window.getCursorPosition();
	const document = await workspace.document;
	return [document.uri, line, character];
}

interface Command {
	command: string;
	title?: string;
	choices?: string[];
}

const refactorCommands: Command[] = [
	{ command: "add-import-to-namespace", title: "Import name?" },
	{ command: "add-missing-libspec" },
	{ command: "clean-ns" },
	{
		command: "change-coll",
		title: "New coll type",
		choices: ["list", "vector", "map", "set"],
	},
	{ command: "cycle-coll" },
	{ command: "cycle-privacy" },
	{ command: "expand-let" },
	{ command: "extract-function", title: "Function name?" },
	{ command: "inline-symbol" },
	{ command: "introduce-let", title: "Bind to?" },
	{ command: "move-to-let", title: "Bind to?" },
	{ command: "thread-first" },
	{ command: "thread-first-all" },
	{ command: "thread-last" },
	{ command: "thread-last-all" },
	{ command: "unwind-all" },
	{ command: "unwind-thread" },
];

async function titleForBinding(title: string): Promise<string> {
	const result = await window.requestInput(title, "");
	const trimmed = result.trim();
	return trimmed === "" ? "___ empty input" : trimmed;
}

async function titleWithChoices(title: string, choices: string[]): Promise<string> {
	const result = await window.showMenuPicker(choices, title);
	if (result === -1) return;
	return choices[result];
}

async function executeCommand(
	client: LanguageClient,
	{ command }: Command,
	params: CommandParams
): Promise<any> {
	return client
		.sendRequest("workspace/executeCommand", {
			command,
			arguments: params,
		})
		.catch((error) => {
			window.showErrorMessage(error);
		});
}

async function executePromptCommand(
	client: LanguageClient,
	cmd: Command,
	params: CommandParams
): Promise<any> {
	const { title } = cmd;
	const extraParam = await titleForBinding(title);
	if (extraParam === "___ empty input") {
		return;
	}
	params.push(extraParam);
	return executeCommand(client, cmd, params);
}

async function executeChoicesCommand(
	client: LanguageClient,
	cmd: Command,
	params: CommandParams
): Promise<any> {
	const { title, choices } = cmd;
	const extraParam = await titleWithChoices(title, choices);
	params.push(extraParam);
	return executeCommand(client, cmd, params);
}

function registerCommand(client: LanguageClient, cmd: Command): Disposable {
	const { command, title, choices } = cmd;
	const id = `lsp-clojure-${command}`;

	return commands.registerCommand(id, async () => {
		const position = await getUriAndPosition();

		if (choices && !workspace.env.dialog) {
			return;
		} else if (choices) {
			await executeChoicesCommand(client, cmd, position);
		} else if (title) {
			await executePromptCommand(client, cmd, position);
		} else {
			await executeCommand(client, cmd, position);
		}
	});
}

export function createCommands(context: ExtensionContext, client: LanguageClient): void {
	context.subscriptions.push(
		commands.registerCommand("lsp-clojure-server-info", async () => {
			return client.sendRequest("clojure/serverInfo/log");
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
