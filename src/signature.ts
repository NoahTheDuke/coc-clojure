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
	): Promise<SignatureHelp | null> {
		return this.client
			.sendRequest<SignatureHelp>(
				"textDocument/signatureHelp",
				{
					textDocument: { uri: document.uri },
					position,
					context,
				},
				token
			)
			.catch<null>((error) => {
				return this.client.handleFailedRequest(
					{ method: "textDocument/signatureHelp" } as any,
					token,
					error,
					null
				);
			});
	}
}
