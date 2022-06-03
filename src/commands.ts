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
import * as commandsJson from "./commands.json";
import { config } from "./config";
import { logger } from "./logger";
import { Dictionary } from "./types";

type CommandParams = (string | number)[];

async function getInput(
	title: string | undefined,
	defaultTitle = ""
): Promise<string | undefined> {
	if (!title) return;
	const result = await window.requestInput(title, defaultTitle);
	return result.trim();
}

async function fetchDocs(client: LanguageClient) {
	const symName = await getInput("Var name?");
	const symNs = await getInput("Namespace?", "clojure.core");
	if (symName && symNs) {
		const result = await client
			.sendRequest<Dictionary<string>>("clojure/clojuredocs/raw", {
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

const complexCommands: Command[] = [
	// As defined here: https://clojure-lsp.io/features/#clojure-lsp-extra-commands
	{
		command: "docs",
		fn: fetchDocs,
	},
	{
		command: "cursor-info",
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
		command: "server-info",
		fn: async (client) => {
			return client.sendRequest("clojure/serverInfo/log").catch((error) => {
				window.showErrorMessage(error);
			});
		},
	},
];

const clojureCommands: Command[] = (() => {
	const { commands } = commandsJson as { commands: Command[] };
	const mergedCommands: Map<string, Command> = new Map();
	commands.concat(complexCommands).forEach((cmd) => {
		const title = cmd.command;
		if (!mergedCommands.has(title)) {
			mergedCommands.set(title, { command: title });
		}
		for (const [key, value] of Object.entries(cmd)) {
			const command = mergedCommands.get(title);
			if (command && !command[key as keyof Command]) {
				command[key as keyof Command] = value;
			}
		}
	});
	return [...mergedCommands.values()];
})();

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

async function titleWithChoices(
	title: string | undefined,
	choices: string[] | undefined
): Promise<string | undefined> {
	if (!title || !choices) return;
	const result = await window.showMenuPicker(choices, { title });
	if (result === -1) return;
	return choices[result];
}

async function executeChoicesCommand(
	client: LanguageClient,
	cmd: Command
): Promise<any> {
	const { title, choices } = cmd;
	const choice = await titleWithChoices(title, choices);
	const extraParams = [];
	if (choice) extraParams.push(choice);
	return executePositionCommand(client, cmd, extraParams);
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
	const { keymaps } = config();
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

	if (config().keymaps.enable) {
		for (const cmd of clojureCommands.filter((cmd) => cmd.shortcut)) {
			registerKeymap(context, cmd);
		}
	}
}
