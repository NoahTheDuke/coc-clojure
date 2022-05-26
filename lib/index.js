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

// src/commands.json
var commands_exports = {};
__export(commands_exports, {
  data: () => data,
  default: () => commands_default
});
var data = [
  {
    command: "add-import-to-namespace",
    description: "Add specific require form to current namespace declaration",
    prompt: "Library name?",
    shortcut: "ai"
  },
  {
    command: "add-missing-import",
    description: "Add Java import for symbol under cursor to current namespace declaration"
  },
  {
    command: "add-missing-libspec",
    description: "Add require form for symbol under cursor to current namespace declaration",
    shortcut: "am"
  },
  {
    command: "add-require-suggestion",
    description: "Add suggested require to ns form",
    shortcut: "as"
  },
  {
    aliases: ["change-coll"],
    choices: ["list", "vector", "map", "set"],
    command: "change-collection",
    description: "Choose new type of collection",
    prompt: "New coll type"
  },
  {
    command: "clean-ns",
    description: "Sort and remove unused required libraries in namespace declaration",
    shortcut: "cn"
  },
  {
    command: "create-function",
    description: "Create a function from the current form",
    shortcut: "fe"
  },
  {
    command: "create-test",
    description: "Creates a test somewhere, who knows",
    shortcut: "ct"
  },
  {
    command: "cursor-info",
    description: "Show debugging information for the symbol at cursor"
  },
  {
    command: "cycle-coll",
    description: "Cycle the kind of collection: list -> map -> vector -> set -> list",
    shortcut: "cc"
  },
  {
    command: "cycle-privacy",
    description: "Cycle the privacy of current function definition",
    shortcut: "cp"
  },
  {
    command: "demote-fn",
    description: "Demote fn to #()",
    shortcut: "dm"
  },
  {
    command: "docs",
    description: "Read the docs for a given symbol (in given namespace)"
  },
  {
    aliases: ["move-coll-entry-up"],
    command: "drag-backward",
    description: "Move coll entry backwards in collection (will move map entries)",
    shortcut: "db"
  },
  {
    aliases: ["move-coll-entry-down"],
    command: "drag-forward",
    description: "Move coll entry forwards in collection (will move map entries)",
    shortcut: "df"
  },
  {
    command: "expand-let",
    description: "Move current let form up a level",
    shortcut: "el"
  },
  {
    command: "extract-function",
    description: "Move current form into new top-level function",
    prompt: "Function name?",
    shortcut: "ef"
  },
  {
    command: "inline-symbol",
    description: "Replace all instances of symbol with symbol definition",
    shortcut: "is"
  },
  {
    command: "introduce-let",
    description: "Move current form to let-bound variable",
    prompt: "Bind to?",
    shortcut: "il"
  },
  {
    command: "move-coll-entry-down",
    description: "Move the current element (or pair) down within the collection"
  },
  {
    command: "move-coll-entry-up",
    description: "Move the current element (or pair) up within the collection"
  },
  {
    command: "move-form",
    description: "Move form under cursor to specified file",
    prompt: "Which file?",
    shortcut: "mf"
  },
  {
    command: "move-to-let",
    description: "Move current form into surrounding let block",
    prompt: "Bind to?",
    shortcut: "ml"
  },
  {
    command: "promote-fn",
    description: "Promote #() to fn, or fn to defn",
    shortcut: "pf"
  },
  {
    command: "resolve-macro-as",
    description: "Add entry to .clj-kondo/config.edn to resolve macro as another macro",
    shortcut: "ma"
  },
  {
    command: "server-info",
    description: "Show server configuration information"
  },
  {
    command: "sort-map",
    description: "Sort entries within current map",
    shortcut: "sm"
  },
  {
    command: "suppress-diagnostic",
    description: "Add a :clj-kondo/ignore to suppress linting current line",
    prompt: "Lint to ignore?"
  },
  {
    command: "thread-first",
    description: "Replace current form with thread-first expession",
    shortcut: "th"
  },
  {
    command: "thread-first-all",
    description: "Replace current and all nested forms with thread-first form",
    shortcut: "tf"
  },
  {
    command: "thread-last",
    description: "Replace current form with thread-last expession",
    shortcut: "tt"
  },
  {
    command: "thread-last-all",
    description: "Replace current and all nested forms with thread-last form",
    shortcut: "tl"
  },
  {
    command: "unwind-all",
    description: "Replace entire current threaded form with nested form",
    shortcut: "ua"
  },
  {
    command: "unwind-thread",
    description: "Replace first two forms in current threaded form with nested form",
    shortcut: "uw"
  }
];
var commands_default = {
  data
};

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
var complexCommands = [
  {
    command: "docs",
    fn: fetchDocs
  },
  {
    command: "cursor-info",
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
    command: "server-info",
    fn: async (client) => {
      return client.sendRequest("clojure/serverInfo/log").catch((error) => {
        import_coc3.window.showErrorMessage(error);
      });
    }
  }
];
var clojureCommands = (() => {
  const { data: simpleCommands } = commands_exports;
  const mergedCommands = {};
  simpleCommands.forEach((cmd) => {
    const title = cmd.command;
    if (!mergedCommands[title]) {
      mergedCommands[title] = {};
    }
    for (const [key, value] of Object.entries(cmd)) {
      mergedCommands[title][key] = value;
    }
  });
  complexCommands.forEach((cmd) => {
    const title = cmd.command;
    if (!mergedCommands[title]) {
      mergedCommands[title] = {};
    }
    for (const [key, value] of Object.entries(cmd)) {
      mergedCommands[title][key] = value;
    }
  });
  return Object.values(mergedCommands);
})();
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
