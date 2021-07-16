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
var import_coc = __toModule(require("coc.nvim"));
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
    documentSelector: ["clojure"],
    initializationOptions: config.initializationOptions
  };
  return new import_coc.LanguageClient("clojure", "Clojure Language Client", serverOptions, clientOptions);
}

// src/commands.ts
var import_coc2 = __toModule(require("coc.nvim"));
async function getUriAndPosition() {
  const {line, character} = await import_coc2.window.getCursorPosition();
  const document = await import_coc2.workspace.document;
  return [document.uri, line, character];
}
var refactorCommands = [
  {command: "add-import-to-namespace", title: "Import name?"},
  {command: "add-missing-libspec"},
  {command: "clean-ns"},
  {
    command: "change-coll",
    title: "New coll type",
    choices: ["list", "vector", "map", "set"]
  },
  {command: "cycle-coll"},
  {command: "cycle-privacy"},
  {command: "expand-let"},
  {command: "extract-function", title: "Function name?"},
  {command: "inline-symbol"},
  {command: "introduce-let", title: "Bind to?"},
  {command: "move-to-let", title: "Bind to?"},
  {command: "thread-first"},
  {command: "thread-first-all"},
  {command: "thread-last"},
  {command: "thread-last-all"},
  {command: "unwind-all"},
  {command: "unwind-thread"}
];
async function titleForBinding(title) {
  const result = await import_coc2.window.requestInput(title, "");
  const trimmed = result.trim();
  return trimmed === "" ? "___ empty input" : trimmed;
}
async function titleWithChoices(title, choices) {
  const result = await import_coc2.window.showMenuPicker(choices, title);
  if (result === -1)
    return;
  return choices[result];
}
async function executeCommand(client, {command}, params) {
  return client.sendRequest("workspace/executeCommand", {
    command,
    arguments: params
  }).catch((error) => {
    import_coc2.window.showErrorMessage(error);
  });
}
async function executePromptCommand(client, cmd, params) {
  const {title} = cmd;
  const extraParam = await titleForBinding(title);
  if (extraParam === "___ empty input") {
    return;
  }
  params.push(extraParam);
  return executeCommand(client, cmd, params);
}
async function executeChoicesCommand(client, cmd, params) {
  const {title, choices} = cmd;
  const extraParam = await titleWithChoices(title, choices);
  params.push(extraParam);
  return executeCommand(client, cmd, params);
}
function registerCommand(client, cmd) {
  const {command, title, choices} = cmd;
  const id = `lsp-clojure-${command}`;
  return import_coc2.commands.registerCommand(id, async () => {
    const position = await getUriAndPosition();
    if (choices && !import_coc2.workspace.env.dialog) {
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
function createCommands(context, client) {
  context.subscriptions.push(import_coc2.commands.registerCommand("lsp-clojure-server-info", async () => {
    return client.sendRequest("clojure/serverInfo/log");
  }), import_coc2.commands.registerCommand("lsp-clojure-cursor-info", async () => {
    return client.sendRequest("workspace/executeCommand", {
      command: "cursor-info",
      arguments: await getUriAndPosition()
    });
  }), ...refactorCommands.map((cmd) => registerCommand(client, cmd)));
}

// src/config.ts
var import_coc3 = __toModule(require("coc.nvim"));
function getConfig() {
  const config = import_coc3.workspace.getConfiguration("clojure");
  return {
    enable: config.get("enable", true),
    executable: config.get("executable", "clojure-lsp"),
    executableArgs: config.get("executableArgs"),
    startupMessage: config.get("startup-message", false),
    initializationOptions: config.get("initialization-options")
  };
}

// src/index.ts
async function activate(context) {
  const config = getConfig();
  if (!config.enable)
    return;
  let statusItem;
  if (config.startupMessage) {
    statusItem = import_coc4.window.createStatusBarItem(void 0, {progress: true});
    statusItem.text = `Loading clojure-lsp`;
    statusItem.show();
  }
  const client = createClient(config);
  context.subscriptions.push(import_coc4.services.registLanguageClient(client));
  createCommands(context, client);
  if (config.startupMessage) {
    await client.onReady();
    statusItem == null ? void 0 : statusItem.dispose();
    import_coc4.window.showMessage("clojure-lsp loaded!");
  }
}
