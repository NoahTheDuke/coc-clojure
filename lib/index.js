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
  const executablePath = config.executable;
  const serverOptions = {
    run: {command: executablePath},
    debug: {command: executablePath}
  };
  const initializationOptions = {
    "use-metadata-for-privacy?": true,
    "ignore-classpath-directories": true
  };
  const clientOptions = {
    documentSelector: ["clojure"],
    initializationOptions: Object.assign(initializationOptions, config.initializationOptions)
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
  {command: "add-import-to-namespace", promptTitle: "Import name?"},
  {command: "add-missing-libspec"},
  {command: "clean-ns"},
  {command: "cycle-coll"},
  {command: "cycle-privacy"},
  {command: "expand-let"},
  {command: "extract-function", promptTitle: "Function name?"},
  {command: "inline-symbol"},
  {command: "introduce-let", promptTitle: "Bind to?"},
  {command: "move-to-let", promptTitle: "Bind to?"},
  {command: "thread-first"},
  {command: "thread-first-all"},
  {command: "thread-last"},
  {command: "thread-last-all"},
  {command: "unwind-all"},
  {command: "unwind-thread"}
];
async function promptForBinding(title) {
  const result = await import_coc2.window.requestInput(title, "");
  const trimmed = result.trim();
  return trimmed === "" ? "___ empty input" : trimmed;
}
function registerCommand(client, cmd) {
  const {command, promptTitle} = cmd;
  const id = `lsp-clojure-${command}`;
  return import_coc2.commands.registerCommand(id, async () => {
    const extraParam = promptTitle ? await promptForBinding(promptTitle) : null;
    if (extraParam === "___ empty input") {
      return;
    }
    const position = await getUriAndPosition();
    const params = [...position, ...extraParam || []];
    client.sendRequest("workspace/executeCommand", {
      command,
      arguments: params
    }).catch((error) => {
      import_coc2.window.showErrorMessage(error);
    });
  });
}
function createCommands(context, client) {
  context.subscriptions.push(import_coc2.commands.registerCommand("lsp-clojure-server-info", async () => {
    return client.sendRequest("clojure/serverInfo/log");
  }), import_coc2.commands.registerCommand("lsp-clojure-server-info-raw", async () => {
    return client.sendRequest("clojure/serverInfo/raw");
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
