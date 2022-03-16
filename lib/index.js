var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// src/index.ts
__markAsModule(exports);
__export(exports, {
  activate: () => activate
});
var import_coc4 = __toModule(require("coc.nvim"));

// src/client.ts
var import_coc2 = __toModule(require("coc.nvim"));

// src/config.ts
var import_coc = __toModule(require("coc.nvim"));
var documentSelector = [
  {scheme: "file", language: "clojure"},
  {scheme: "jar", language: "clojure"},
  {scheme: "zipfile", language: "clojure"}
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
    documentSelector,
    initializationOptions: config.initializationOptions
  };
  const client = new import_coc2.LanguageClient("clojure", "Clojure Language Client", serverOptions, clientOptions);
  return client;
}

// src/commands.ts
var import_coc3 = __toModule(require("coc.nvim"));
async function getUriAndPosition() {
  const {line, character} = await import_coc3.window.getCursorPosition();
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
  {command: "add-import-to-namespace", title: "Import name?"},
  {command: "add-missing-import"},
  {command: "add-missing-libspec"},
  {command: "add-require-suggestion"},
  {command: "change-coll", title: "New coll type", choices: ["list", "vector", "map", "set"]},
  {command: "clean-ns"},
  {command: "create-function"},
  {command: "create-test"},
  {command: "cycle-coll"},
  {command: "cycle-privacy"},
  {command: "expand-let"},
  {command: "extract-function", title: "Function name?"},
  {command: "inline-symbol"},
  {command: "introduce-let", title: "Bind to?"},
  {command: "move-coll-entry-down"},
  {command: "move-coll-entry-up"},
  {command: "move-to-let", title: "Bind to?"},
  {command: "resolve-macro-as", title: "Function name?"},
  {command: "sort-map"},
  {command: "suppress-diagnostic", title: "Lint to ignore?"},
  {command: "thread-first"},
  {command: "thread-first-all"},
  {command: "thread-last"},
  {command: "thread-last-all"},
  {command: "unwind-all"},
  {command: "unwind-thread"},
  {
    command: "docs",
    fn: fetchDocs
  },
  {
    command: "server-cursor-info",
    fn: async (client) => {
      const [uri, line, character] = await getUriAndPosition();
      return client.sendRequest("clojure/cursorInfo/log", {
        textDocument: {uri},
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
        textDocument: {uri},
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
async function executePositionCommand(client, {command}, extraParams = []) {
  const position = await getUriAndPosition();
  return client.sendRequest("workspace/executeCommand", {
    command,
    arguments: position.concat(extraParams)
  }).catch((error) => {
    import_coc3.window.showErrorMessage(error);
  });
}
async function titleWithChoices(title, choices) {
  const result = await import_coc3.window.showMenuPicker(choices, title);
  if (result === -1)
    return;
  return choices[result];
}
async function executeChoicesCommand(client, cmd) {
  const {title, choices} = cmd;
  const extraParam = await titleWithChoices(title, choices);
  return executePositionCommand(client, cmd, [extraParam]);
}
async function executePromptCommand(client, cmd) {
  const {title} = cmd;
  const extraParam = await getInput(title);
  if (extraParam) {
    return executePositionCommand(client, cmd, [extraParam]);
  }
}
function registerCommand(client, cmd) {
  const {command, fn, title, choices} = cmd;
  const id = `lsp-clojure-${command}`;
  return import_coc3.commands.registerCommand(id, async () => {
    if (choices && !import_coc3.workspace.env.dialog) {
      return;
    } else if (fn) {
      const {fn: fn2} = cmd;
      return fn2(client);
    } else if (choices) {
      await executeChoicesCommand(client, cmd);
    } else if (title) {
      await executePromptCommand(client, cmd);
    } else {
      await executePositionCommand(client, cmd);
    }
  });
}
function registerCommands(context, client) {
  context.subscriptions.push(...clojureCommands.map((cmd) => registerCommand(client, cmd)));
}

// src/logger.ts
var logger;
function setLogger(context) {
  logger = context.logger;
}

// src/index.ts
async function activate(context) {
  const config = getConfig();
  if (!config.enable)
    return;
  setLogger(context);
  let statusItem;
  if (config.startupMessage) {
    logger.info("Showing statusItem");
    statusItem = import_coc4.window.createStatusBarItem(void 0, {progress: true});
    statusItem.text = `Loading clojure-lsp`;
    statusItem.show();
  }
  logger.info("Creating client", config);
  const client = createClient(config);
  context.subscriptions.push(import_coc4.services.registLanguageClient(client));
  registerCommands(context, client);
  await client.onReady();
  if (config.startupMessage) {
    logger.info("Disposing statusItem");
    statusItem == null ? void 0 : statusItem.dispose();
    import_coc4.window.showMessage("clojure-lsp loaded!");
  }
}
