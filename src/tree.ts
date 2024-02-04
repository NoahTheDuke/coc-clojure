// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {
	CancellationToken,
	commands,
	Emitter,
	ExtensionContext,
	LanguageClient,
	ProviderResult,
	Range,
	TreeDataProvider,
	TreeItem,
	TreeItemCollapsibleState,
	Uri,
	window,
	workspace,
} from "coc.nvim";
import { logger } from "./logger";

// {
// 	name: "core_regression",
// 	type: 1,
// 	nodes: [
// 		{ name: "src", final: false, type: 2 },
// 		{ name: "test", final: false, type: 2 },
// 		{
// 			name: "External dependencies",
// 			id: "external-dependencies",
// 			final: false,
// 			type: 3,
// 		},
// 	],
// },

enum ProjectTreeNodeType {
	project = 1,
	sourcePath = 2,
	libary = 3,
	jar = 4,
	ns = 5,
	class = 6,
	function = 7,
	variable = 8,
	interface = 9,
}

interface ProjectTreeNodeLeaf {
	name: string;
	type: ProjectTreeNodeType;
	id?: string;
	uri?: string;
	range?: Range;
	detail?: string;
	final: boolean;
}

interface ProjectTreeNodeBranch {
	name: string;
	type: ProjectTreeNodeType;
	uri?: string;
	detail?: string;
	id?: string;
	nodes: ProjectTreeNode[];
}

type ProjectTreeNode = ProjectTreeNodeBranch & ProjectTreeNodeLeaf;

async function requestProjectTree(
	client: LanguageClient,
	param?: ProjectTreeNodeLeaf,
): Promise<ProjectTreeNode> {
	const result = await client.sendRequest<ProjectTreeNode>(
		"clojure/workspace/projectTree/nodes",
		param,
	);
	logger.debug("raw", JSON.stringify(result));
	return result;
}

class ProjectTree implements TreeDataProvider<ProjectTreeNode> {
	private client: LanguageClient;
	private root?: ProjectTreeNode;
	private doc?: Uri;
	private winid?: number;

	private _onDidChangeTreeData = new Emitter<ProjectTreeNode | null>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	constructor(client: LanguageClient) {
		this.client = client;
	}

	setRoot(newRoot?: ProjectTreeNode, newDoc?: Uri, winid?: number) {
		this.root = newRoot;
		this.doc = newDoc;
		this.winid = winid;
		this._onDidChangeTreeData.fire(null);
	}

	public getTreeItem(node: ProjectTreeNode): TreeItem {
		logger.debug("getTreeItem", JSON.stringify(node, null, 4));
		const item = new TreeItem(node.name);
		item.description = node.detail;

		if (node.nodes?.length > 0) {
			item.collapsibleState = TreeItemCollapsibleState.Expanded;
		} else if (!node.final) {
			item.collapsibleState = TreeItemCollapsibleState.Collapsed;
		}
		if (node.uri) {
			item.resourceUri = Uri.parse(node.uri);
		}
		if (node.range && this.winid) {
			item.command = {
				title: "Jump to",
				command: "workspace.openLocation",
				arguments: [this.winid, { uri: this.doc, range: node.range }],
			};
		}
		return item;
	}

	public async resolveTreeItem(
		item: TreeItem | undefined,
		node: ProjectTreeNode,
	): Promise<TreeItem | undefined> {
		logger.debug("resolveTreeItem item", JSON.stringify([item, node], null, 4));
		const updatedNode = await requestProjectTree(this.client, node);
		if (!updatedNode) return item;
		const newItem = this.getTreeItem(updatedNode);
		logger.debug(
			"resolveTreeItem result",
			JSON.stringify([updatedNode, newItem], null, 4),
		);
		return newItem;
	}

	public async getChildren(node?: ProjectTreeNode): Promise<ProjectTreeNode[]> {
		logger.debug("getChildren", JSON.stringify(node, null, 4));
		if (node) {
			if (node.nodes) return node.nodes;
			const updatedNode = await requestProjectTree(this.client, node);
			return updatedNode?.nodes || [];
		}
		if (this.root) {
			return [this.root];
		}
		return [];
	}

	public getParent(node: ProjectTreeNode): ProjectTreeNode | undefined {
		logger.debug("getParent", JSON.stringify(node, null, 4));
		if (node === this.root) return undefined;

		function findUnder(parent?: ProjectTreeNode): ProjectTreeNode | undefined {
			const children = parent?.nodes || [];
			for (const child of children) {
				const result = node === child ? parent : findUnder(child);
				if (result) return result;
			}
			return undefined;
		}
		return findUnder(this.root);
	}
}

export async function projectTree(
	client: LanguageClient,
	context: ExtensionContext,
): Promise<void> {
	const initialTree = await requestProjectTree(client);
	const winid = (await workspace.nvim.eval("win_getid()")) as number;
	const adapter = new ProjectTree(client);
	const { document } = await workspace.getCurrentState();
	adapter.setRoot(initialTree, Uri.parse(document.uri), winid);
	const treeView = window.createTreeView("project-tree", {
		treeDataProvider: adapter,
	});
	context.subscriptions.push(treeView);
	context.subscriptions.push(
		commands.registerCommand("_project-tree", (node: ProjectTreeNode) => {
			return adapter.resolveTreeItem(undefined, node);
		}),
	);
	await treeView.show();
}
