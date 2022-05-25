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
import { config } from "./config";
import { logger } from "./logger";

type CommandParams = (string | number)[];

async function getInput(title: string, defaultTitle = ""): Promise<string> {
	const result = await window.requestInput(title, defaultTitle);
	return result.trim();
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

async function getUriAndPosition(): Promise<CommandParams> {
	const { line, character } = await window.getCursorPosition();
	const document = await workspace.document;
	return [document.uri, line, character];
}

interface Command {
	command: string;
	shortcut?: string;
	title?: string;
	choices?: string[];
	fn?: (client: LanguageClient) => Promise<any>;
	aliases?: string[];
}

const clojureCommands: Command[] = [
	// As defined here: https://clojure-lsp.io/features/#clojure-lsp-extra-commands
	{
		command: "add-import-to-namespace",
		shortcut: "ai",
		title: "Import name?",
	},
	{ command: "add-missing-import" },
	{
		command: "add-missing-libspec",
		shortcut: "am",
	},
	{
		command: "add-require-suggestion",
		shortcut: "as",
	},
	{
		command: "change-coll",
		title: "New coll type",
		choices: ["list", "vector", "map", "set"],
		aliases: ["change-collection"],
	},
	{
		command: "clean-ns",
		shortcut: "cn",
	},
	{
		command: "create-function",
		shortcut: "fe",
	},
	{
		command: "create-test",
		shortcut: "ct",
	},
	{
		command: "cycle-coll",
		shortcut: "cc",
	},
	{
		command: "cycle-privacy",
		shortcut: "cp",
	},
	{
		command: "demote-fn",
		shortcut: "dm",
	},
	{
		command: "drag-backward",
		shortcut: "db",
		aliases: ["move-coll-entry-up"],
	},
	{
		command: "drag-forward",
		shortcut: "df",
		aliases: ["move-coll-entry-down"],
	},
	{
		command: "extract-function",
		shortcut: "ef",
		title: "Function name?",
	},
	{
		command: "expand-let",
		shortcut: "el",
	},
	{
		command: "introduce-let",
		shortcut: "il",
		title: "Bind to?",
	},
	{
		command: "inline-symbol",
		shortcut: "is",
	},
	{
		command: "move-form",
		shortcut: "mf",
		title: "Which file?",
	},
	{
		command: "move-to-let",
		shortcut: "ml",
		title: "Bind to?",
	},
	{
		command: "promote-fn",
		shortcut: "pf",
	},
	{
		command: "resolve-macro-as",
		shortcut: "ma",
	},
	{
		command: "sort-map",
		shortcut: "sm",
	},
	{
		command: "thread-first",
		shortcut: "th",
	},
	{
		command: "thread-first-all",
		shortcut: "tf",
	},
	{
		command: "thread-last",
		shortcut: "tt",
	},
	{
		command: "thread-last-all",
		shortcut: "tl",
	},
	{
		command: "unwind-all",
		shortcut: "ua",
	},
	{
		command: "unwind-thread",
		shortcut: "uw",
	},
	{
		command: "suppress-diagnostic",
		title: "Lint to ignore?",
	},
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
	const result = await window.showMenuPicker(choices, { title });
	if (result === -1) return;
	return choices[result];
}

async function executeChoicesCommand(
	client: LanguageClient,
	cmd: Command
): Promise<any> {
	const { title, choices } = cmd;
	const extraParam = await titleWithChoices(title, choices);
	return executePositionCommand(client, cmd, [extraParam]);
}

async function executePromptCommand(
	client: LanguageClient,
	cmd: Command
): Promise<any> {
	const { title } = cmd;
	const extraParam = await getInput(title);
	if (extraParam) {
		return executePositionCommand(client, cmd, [extraParam]);
	}
}

function registerCommand(
	context: ExtensionContext,
	client: LanguageClient,
	cmd: Command
): void {
	const { command, fn, title, choices, aliases } = cmd;
	const id = `lsp-clojure-${command}`;
	const func = async () => {
		if (choices && !workspace.env.dialog) {
			logger.info(`Workspace doesn't allow dialogs, cancelling command ${id}`);
			return;
		} else if (fn) {
			const { fn } = cmd;
			logger.debug(`Executing 'fn' command ${id}`);
			return fn(client);
		} else if (choices) {
			logger.debug(`Executing 'choices' command ${id}`);
			await executeChoicesCommand(client, cmd);
		} else if (title) {
			logger.debug(`Executing 'prompt' command ${id}`);
			await executePromptCommand(client, cmd);
		} else {
			logger.debug(`Executing 'position' command ${id}`);
			await executePositionCommand(client, cmd);
		}
	};

	logger.debug(`Registering command ${id}`);
	context.subscriptions.push(commands.registerCommand(id, func));

	if (aliases) {
		aliases.forEach((alias) => {
			const aliasId = `lsp-clojure-${alias}`;
			logger.debug(`Registering command ${aliasId} as alias of ${id}`);
			context.subscriptions.push(commands.registerCommand(aliasId, func));
		});
	}
}

function registerKeymap(context: ExtensionContext, cmd: Command): void {
	const { command, shortcut } = cmd;
	const id = `lsp-clojure-${command}`;
	const { keymaps } = config;
	const keymap = `${keymaps.shortcut}${shortcut}`;
	try {
		logger.debug(`Creating keymap '${keymap}' for command '${id}'`);
		workspace.nvim.command(
			`nnoremap <silent> ${keymap} :call CocActionAsync('runCommand', '${id}')<CR>`,
			true
		);
		context.subscriptions.push(
			Disposable.create(() => {
				workspace.nvim.command(`nunmap ${keymap}`, true);
			})
		);
	} catch (e) {
		logger.error(`Can't create keymapping ${keymap} for command ${command}`, e);
	}
}

export function registerCommands(
	context: ExtensionContext,
	client: LanguageClient
): void {
	for (const cmd of clojureCommands) {
		registerCommand(context, client, cmd);
	}

	if (config.keymaps.enable) {
		for (const cmd of clojureCommands.filter((cmd) => cmd.shortcut)) {
			registerKeymap(context, cmd);
		}
	}
}
