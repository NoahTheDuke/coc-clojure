// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {
	CancellationToken,
	LanguageClient,
	Position,
	SignatureHelp,
	SignatureHelpContext,
	SignatureHelpProvider,
	TextDocument,
} from "coc.nvim";
import { logger } from "./logger";

export class ClojureSignatureHelpProvider implements SignatureHelpProvider {
	client: LanguageClient;
	constructor(client: LanguageClient) {
		this.client = client;
	}

	async provideSignatureHelp(
		document: TextDocument,
		position: Position,
		token: CancellationToken,
		context: SignatureHelpContext
	): Promise<SignatureHelp> {
		logger.info("provideSignatureHelp");
		return this.client
			.sendRequest(
				"textDocument/signatureHelp",
				{
					textDocument: { uri: document.uri },
					position,
					context,
				},
				token
			)
			.then(
				(res) => res,
				(error) => {
					return this.client.handleFailedRequest(
						{ method: "textDocument/signatureHelp" } as any,
						token,
						error,
						null
					);
				}
			);
	}
}
