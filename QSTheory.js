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
	"lastUpdated": "2024-03-23 06:49:38"
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
	if (url.includes('/dukan/')) {
		return "magazineArticle";
	}
	else if (url.includes('/zhuanqu/')) {
		return "newspaperArticle"
	}
	else if (url.includes('/yaowen/')) {
		return "newspaperArticle"
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

async function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (items) ZU.processDocuments(Object.keys(items), scrape);
		});
	}
	else {
		await scrape(doc, url);
	}
}

async function scrape(doc, url) {
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
		trans.itemType = detectWeb(doc, url);
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
	},
	{
		"type": "web",
		"url": "http://www.qstheory.cn/zhuanqu/2024-03/16/c_1130090589.htm",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "“六个如何始终”，习近平总书记系统阐释大党独有难题",
				"creators": [
					{
						"lastName": "学而时习工作室",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"date": "2024-03-16 10:19:46",
				"language": "zh-cn",
				"libraryCatalog": "www.qstheory.cn",
				"publicationTitle": "求是网",
				"url": "http://www.qstheory.cn/zhuanqu/2024-03/16/c_1130090589.htm",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.qstheory.cn/yaowen/2024-03/23/c_1130094824.htm",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "习近平就俄罗斯发生严重恐怖袭击事件向俄罗斯总统普京致慰问电",
				"creators": [],
				"date": "2024-03-23 14:08:18",
				"language": "zh-cn",
				"libraryCatalog": "www.qstheory.cn",
				"publicationTitle": "求是网",
				"url": "http://www.qstheory.cn/yaowen/2024-03/23/c_1130094824.htm",
				"attachments": [],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
