// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { LanguageClient, Range, TreeItem, window } from "coc.nvim";
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
// ProjectTreeNode: ProjectTreeNodeBranch | ProjectTreeNodeLeaf
// ProjectTreeNodeBranch: {:name string, :type ProjectTreeNodeType, :uri string?, :detail string?, :id string?, :nodes [ProjectTreeNode]}
// ProjectTreeNodeLeaf: {:name string, :type ProjectTreeNodeType, :id string?, :uri string?, :range Range?, :detail string?, final boolean}
// ProjectTreeNodeType: :project 1 | :source-path 2 | :library 3 | :jar 4 | :ns 5 | :class 6 | :function 7 | :variable 8 | :interface 9

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

type ProjectTreeNode = ProjectTreeNodeBranch | ProjectTreeNodeLeaf;

async function requestProjectTree(
	client: LanguageClient,
	param?: any,
): Promise<ProjectTreeNode> {
	return client.sendRequest("clojure/workspace/projectTree/nodes", param);
}

export async function projectTree(client: LanguageClient): Promise<any> {
	const result: ProjectTreeNode = await requestProjectTree(client);
	const treeView = window.createTreeView("project-tree", {
		treeDataProvider: {
			getChildren(element: any) {
				logger.info("getChildren", JSON.stringify(element));
				return [result];
			},
			getTreeItem(element) {
				logger.info("getTreeItem", JSON.stringify(element));
				return new TreeItem(element.name);
			},
		},
	});
	treeView.show();
	logger.info(JSON.stringify(result));
	return result;
}
