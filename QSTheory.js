{
	"translatorID": "212d7325-e759-455c-9984-2a06a37b1929",
	"label": "QSTheory",
	"creator": "Misaka",
	"target": "^https?://www\\.qstheory\\.cn",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-11-26 10:16:36"
}

/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2021 Misaka

	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/


function detectWeb(doc, url) {
	// TODO: adjust the logic here
	if (url.includes('/dukan/')) {
		return "magazineArticle";
	}
	else if (getSearchResults(doc, true)) {
		return "multiple";
	}
	return false;
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	// TODO: adjust the CSS selector
	var rows = doc.querySelectorAll('h2>a.title[href*="/article/"]');
	for (let row of rows) {
		// TODO: check and maybe adjust
		let href = row.href;
		// TODO: check and maybe adjust
		let title = ZU.trimInternal(row.textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (items) ZU.processDocuments(Object.keys(items), scrape);
		});
	}
	else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {
	var translator = Zotero.loadTranslator('web');
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	// translator.setDocument(doc);

	translator.setHandler('itemDone', function (obj, item) {
		item.title = text(doc, "div > h1");
		item.date = text(doc, "div > span.pubtime");
		item.creators = [];
		const author = text(doc, "div > span:nth-child(4)").replace("作者：", "");
		item.creators.push({ lastName: author, creatorType: "author", fieldMode: 1});
		item.volume = text(doc, "div > span:nth-child(3)").replace("来源：《求是》", "");
		item.attachments = [];
		item.publicationTitle = "求是网";
		item.complete();
	});

	translator.getTranslatorObject(function (trans) {
		trans.itemType = "magazineArticle";
		trans.doWeb(doc, url);
	});
}
/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://www.qstheory.cn/dukan/qs/2021-07/15/c_1127656422.htm",
		"items": [
			{
				"itemType": "magazineArticle",
				"title": "在庆祝中国共产党成立100周年大会上的讲话",
				"creators": [
					{
						"lastName": "习近平",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"date": "2021-07-15 15:10:31",
				"language": "zh-cn",
				"libraryCatalog": "www.qstheory.cn",
				"publicationTitle": "求是网",
				"url": "http://www.qstheory.cn/dukan/qs/2021-07/15/c_1127656422.htm",
				"volume": "2021/14",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.qstheory.cn/dukan/qs/2021-11/15/c_1128063854.htm",
		"items": [
			{
				"itemType": "magazineArticle",
				"title": "坚持用马克思主义及其中国化创新理论武装全党",
				"creators": [
					{
						"lastName": "习近平",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"date": "2021-11-15 15:09:25",
				"language": "zh-cn",
				"libraryCatalog": "www.qstheory.cn",
				"publicationTitle": "求是网",
				"url": "http://www.qstheory.cn/dukan/qs/2021-11/15/c_1128063854.htm",
				"volume": "2021/22",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
