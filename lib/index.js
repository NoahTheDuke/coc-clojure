var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);
var import_coc4 = require("coc.nvim");

// src/client.ts
var import_coc2 = require("coc.nvim");

// src/config.ts
var import_coc = require("coc.nvim");
var documentSelector = [
  { scheme: "file", language: "clojure" },
  { scheme: "jar", language: "clojure" },
  { scheme: "zipfile", language: "clojure" }
];
var config;
function setConfig() {
  const rawConfig = import_coc.workspace.getConfiguration("clojure");
  const keymaps = rawConfig.inspect("keymaps");
  const executable = rawConfig.inspect("executable");
  const enable = rawConfig.inspect("enable");
  const executableArgs = rawConfig.inspect("executableArgs");
  const initializationOptions = rawConfig.inspect("initializationOptions");
  const startupMessage = rawConfig.inspect("startupMessage");
  config = {
    keymaps: {
      enable: rawConfig.get("keymaps.enable", keymaps.defaultValue.enable),
      shortcut: rawConfig.get("keymaps.shortcut", keymaps.defaultValue.shortcut)
    },
    enable: rawConfig.get("enable", enable.defaultValue),
    executable: rawConfig.get("executable", executable.defaultValue),
    executableArgs: rawConfig.get("executableArgs", executableArgs.defaultValue),
    initializationOptions: rawConfig.get("initialization-options", initializationOptions.defaultValue),
    startupMessage: rawConfig.get("startup-message", startupMessage.defaultValue)
  };
}

// src/client.ts
function createClient() {
  const executable = {
    command: config.executable,
    args: config.executableArgs
  };
  const serverOptions = {
    run: executable,
    debug: executable
  };
  const clientOptions = {
    disabledFeatures: ["signatureHelp"],
    documentSelector,
    initializationOptions: config.initializationOptions
  };
  const client = new import_coc2.LanguageClient("clojure", "Clojure Language Client", serverOptions, clientOptions);
  return client;
}

// src/commands.ts
var import_coc3 = require("coc.nvim");

// src/logger.ts
var logger;
function setLogger(context) {
  logger = context.logger;
}

// src/commands.ts
async function getInput(title, defaultTitle = "") {
  const result = await import_coc3.window.requestInput(title, defaultTitle);
  return result.trim();
}
async function fetchDocs(client) {
  const symName = await getInput("Var name?");
  const symNs = await getInput("Namespace?", "clojure.core");
  if (symName && symNs) {
    const result = await client.sendRequest("clojure/clojuredocs/raw", {
      symName,
      symNs
    }).catch((error) => {
      import_coc3.window.showErrorMessage(error);
    });
    if (result) {
      await import_coc3.window.showDialog({
        title: `${result.ns}/${result.name}`,
        content: result.doc
      });
    }
  }
}
async function getUriAndPosition() {
  const { line, character } = await import_coc3.window.getCursorPosition();
  const document = await import_coc3.workspace.document;
  return [document.uri, line, character];
}
var clojureCommands = [
  {
    command: "add-import-to-namespace",
    shortcut: "ai",
    title: "Import name?"
  },
  { command: "add-missing-import" },
  {
    command: "add-missing-libspec",
    shortcut: "am"
  },
  {
    command: "add-require-suggestion",
    shortcut: "as"
  },
  {
    command: "change-coll",
    title: "New coll type",
    choices: ["list", "vector", "map", "set"],
    aliases: ["change-collection"]
  },
  {
    command: "clean-ns",
    shortcut: "cn"
  },
  {
    command: "create-function",
    shortcut: "fe"
  },
  {
    command: "create-test",
    shortcut: "ct"
  },
  {
    command: "cycle-coll",
    shortcut: "cc"
  },
  {
    command: "cycle-privacy",
    shortcut: "cp"
  },
  {
    command: "demote-fn",
    shortcut: "dm"
  },
  {
    command: "drag-backward",
    shortcut: "db",
    aliases: ["move-coll-entry-up"]
  },
  {
    command: "drag-forward",
    shortcut: "df",
    aliases: ["move-coll-entry-down"]
  },
  {
    command: "extract-function",
    shortcut: "ef",
    title: "Function name?"
  },
  {
    command: "expand-let",
    shortcut: "el"
  },
  {
    command: "introduce-let",
    shortcut: "il",
    title: "Bind to?"
  },
  {
    command: "inline-symbol",
    shortcut: "is"
  },
  {
    command: "move-form",
    shortcut: "mf",
    title: "Which file?"
  },
  {
    command: "move-to-let",
    shortcut: "ml",
    title: "Bind to?"
  },
  {
    command: "promote-fn",
    shortcut: "pf"
  },
  {
    command: "resolve-macro-as",
    shortcut: "ma"
  },
  {
    command: "sort-map",
    shortcut: "sm"
  },
  {
    command: "thread-first",
    shortcut: "th"
  },
  {
    command: "thread-first-all",
    shortcut: "tf"
  },
  {
    command: "thread-last",
    shortcut: "tt"
  },
  {
    command: "thread-last-all",
    shortcut: "tl"
  },
  {
    command: "unwind-all",
    shortcut: "ua"
  },
  {
    command: "unwind-thread",
    shortcut: "uw"
  },
  {
    command: "suppress-diagnostic",
    title: "Lint to ignore?"
  },
  {
    command: "docs",
    fn: fetchDocs
  },
  {
    command: "server-cursor-info",
    fn: async (client) => {
      const [uri, line, character] = await getUriAndPosition();
      return client.sendRequest("clojure/cursorInfo/log", {
        textDocument: { uri },
        position: {
          line,
          character
        }
      }).catch((error) => {
        import_coc3.window.showErrorMessage(error);
      });
    }
  },
  {
    command: "server-cursor-info-raw",
    fn: async (client) => {
      const [uri, line, character] = await getUriAndPosition();
      return client.sendRequest("clojure/cursorInfo/raw", {
        textDocument: { uri },
        position: {
          line,
          character
        }
      }).catch((error) => {
        import_coc3.window.showErrorMessage(error);
      });
    }
  },
  {
    command: "server-info",
    fn: async (client) => {
      return client.sendRequest("clojure/serverInfo/log").catch((error) => {
        import_coc3.window.showErrorMessage(error);
      });
    }
  },
  {
    command: "server-info-raw",
    fn: async (client) => {
      return client.sendRequest("clojure/serverInfo/raw").catch((error) => {
        import_coc3.window.showErrorMessage(error);
      });
    }
  }
];
async function executePositionCommand(client, { command }, extraParams = []) {
  const position = await getUriAndPosition();
  return client.sendRequest("workspace/executeCommand", {
    command,
    arguments: position.concat(extraParams)
  }).catch((error) => {
    import_coc3.window.showErrorMessage(error);
  });
}
async function titleWithChoices(title, choices) {
  const result = await import_coc3.window.showMenuPicker(choices, { title });
  if (result === -1)
    return;
  return choices[result];
}
async function executeChoicesCommand(client, cmd) {
  const { title, choices } = cmd;
  const extraParam = await titleWithChoices(title, choices);
  return executePositionCommand(client, cmd, [extraParam]);
}
async function executePromptCommand(client, cmd) {
  const { title } = cmd;
  const extraParam = await getInput(title);
  if (extraParam) {
    return executePositionCommand(client, cmd, [extraParam]);
  }
}
function registerCommand(context, client, cmd) {
  const { command, fn, title, choices, aliases } = cmd;
  const id = `lsp-clojure-${command}`;
  const func = async () => {
    if (choices && !import_coc3.workspace.env.dialog) {
      logger.info(`Workspace doesn't allow dialogs, cancelling command ${id}`);
      return;
    } else if (fn) {
      const { fn: fn2 } = cmd;
      logger.debug(`Executing 'fn' command ${id}`);
      return fn2(client);
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
  context.subscriptions.push(import_coc3.commands.registerCommand(id, func));
  if (aliases) {
    aliases.forEach((alias) => {
      const aliasId = `lsp-clojure-${alias}`;
      logger.debug(`Registering command ${aliasId} as alias of ${id}`);
      context.subscriptions.push(import_coc3.commands.registerCommand(aliasId, func));
    });
  }
}
function registerKeymap(context, cmd) {
  const { command, shortcut } = cmd;
  const id = `lsp-clojure-${command}`;
  const { keymaps } = config;
  const keymap = `${keymaps.shortcut}${shortcut}`;
  try {
    logger.debug(`Creating keymap '${keymap}' for command '${id}'`);
    import_coc3.workspace.nvim.command(`nnoremap <silent> ${keymap} :call CocActionAsync('runCommand', '${id}')<CR>`, true);
    context.subscriptions.push(import_coc3.Disposable.create(() => {
      import_coc3.workspace.nvim.command(`nunmap ${keymap}`, true);
    }));
  } catch (e) {
    logger.error(`Can't create keymapping ${keymap} for command ${command}`, e);
  }
}
function registerCommands(context, client) {
  for (const cmd of clojureCommands) {
    registerCommand(context, client, cmd);
  }
  if (config.keymaps.enable) {
    for (const cmd of clojureCommands.filter((cmd2) => cmd2.shortcut)) {
      registerKeymap(context, cmd);
    }
  }
}

// src/signature.ts
var ClojureSignatureHelpProvider = class {
  constructor(client) {
    this.client = client;
  }
  async provideSignatureHelp(document, position, token, context) {
    logger.info("provideSignatureHelp");
    return this.client.sendRequest("textDocument/signatureHelp", {
      textDocument: { uri: document.uri },
      position,
      context
    }, token).then((res) => res, (error) => {
      return this.client.handleFailedRequest({ method: "textDocument/signatureHelp" }, token, error, null);
    });
  }
};

// src/index.ts
async function activate(context) {
  setLogger(context);
  logger.warn("inside coc-clojure");
  setConfig();
  if (!config.enable)
    return;
  let statusItem;
  if (config.startupMessage) {
    logger.info("Showing statusItem");
    statusItem = import_coc4.window.createStatusBarItem(void 0, { progress: true });
    statusItem.text = "Loading clojure-lsp";
    statusItem.show();
  }
  logger.info("Creating client");
  const client = createClient();
  context.subscriptions.push(import_coc4.services.registLanguageClient(client));
  context.subscriptions.push(import_coc4.languages.registerSignatureHelpProvider(documentSelector, new ClojureSignatureHelpProvider(client), ["(", " "]));
  registerCommands(context, client);
  await client.onReady();
  if (config.startupMessage) {
    logger.info("Disposing statusItem");
    statusItem == null ? void 0 : statusItem.dispose();
    import_coc4.window.showInformationMessage("clojure-lsp loaded!");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
