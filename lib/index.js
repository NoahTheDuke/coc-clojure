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
function getConfig() {
  const config = import_coc.workspace.getConfiguration("clojure");
  return {
    enable: config.get("enable", true),
    executable: config.get("executable", "clojure-lsp"),
    executableArgs: config.get("executableArgs"),
    initializationOptions: config.get("initialization-options"),
    startupMessage: config.get("startup-message", false)
  };
}

// src/client.ts
function createClient(config) {
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
async function getUriAndPosition() {
  const { line, character } = await import_coc3.window.getCursorPosition();
  const document = await import_coc3.workspace.document;
  return [document.uri, line, character];
}
async function getInput(title, defaultTitle = "") {
  const result = (await import_coc3.window.requestInput(title, defaultTitle)).trim();
  return result;
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
var clojureCommands = [
  { command: "add-import-to-namespace", title: "Import name?" },
  { command: "add-missing-import" },
  { command: "add-missing-libspec" },
  { command: "add-require-suggestion" },
  { command: "clean-ns" },
  { command: "create-function" },
  { command: "create-test" },
  { command: "cycle-coll" },
  { command: "cycle-privacy" },
  { command: "demote-fn" },
  { command: "drag-backward", aliases: ["move-coll-entry-down"] },
  { command: "drag-forward", aliases: ["move-coll-entry-up"] },
  { command: "extract-function", title: "Function name?" },
  { command: "expand-let" },
  { command: "create-function" },
  { command: "introduce-let", title: "Bind to?" },
  { command: "inline-symbol" },
  { command: "move-form", title: "Which file?" },
  { command: "move-to-let", title: "Bind to?" },
  { command: "promote-fn" },
  {
    command: "change-coll",
    title: "New coll type",
    choices: ["list", "vector", "map", "set"],
    aliases: ["change-collection"]
  },
  { command: "sort-map" },
  { command: "thread-first" },
  { command: "thread-first-all" },
  { command: "thread-last" },
  { command: "thread-last-all" },
  { command: "unwind-all" },
  { command: "unwind-thread" },
  { command: "suppress-diagnostic", title: "Lint to ignore?" },
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
function registerCommand(client, cmd) {
  const { command, fn, title, choices, aliases } = cmd;
  const id = `lsp-clojure-${command}`;
  const func = async () => {
    if (choices && !import_coc3.workspace.env.dialog) {
      return;
    } else if (fn) {
      const { fn: fn2 } = cmd;
      return fn2(client);
    } else if (choices) {
      await executeChoicesCommand(client, cmd);
    } else if (title) {
      await executePromptCommand(client, cmd);
    } else {
      await executePositionCommand(client, cmd);
    }
  };
  const newCommands = [import_coc3.commands.registerCommand(id, func)];
  if (aliases) {
    aliases.forEach((alias) => {
      const aliasId = `lsp-clojure-${alias}`;
      newCommands.push(import_coc3.commands.registerCommand(aliasId, func));
    });
  }
  return newCommands;
}
function registerCommands(context, client) {
  context.subscriptions.push(...clojureCommands.flatMap((cmd) => registerCommand(client, cmd)));
}

// src/logger.ts
var logger;
function setLogger(context) {
  logger = context.logger;
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
  context.logger.warn("inside coc-clojure");
  const config = getConfig();
  if (!config.enable)
    return;
  setLogger(context);
  let statusItem;
  if (config.startupMessage) {
    logger.info("Showing statusItem");
    statusItem = import_coc4.window.createStatusBarItem(void 0, { progress: true });
    statusItem.text = "Loading clojure-lsp";
    statusItem.show();
  }
  logger.info("Creating client");
  const client = createClient(config);
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
