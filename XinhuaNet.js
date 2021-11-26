{
	"translatorID": "8c5be9da-70d4-4629-9d11-92ab3f9cb8ee",
	"label": "XinhuaNet",
	"creator": "chuxubank",
	"target": "^https?://(www\\.)?(news\\.cn|xinhuanet\\.com)",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-11-26 07:16:45"
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
	if (url.includes('/politics/')) {
		return "newspaperArticle";
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
		item.section = "Politics";
		item.title = doc.querySelector('div.h-title').innerText;
		item.publicationTitle = doc.querySelector('span.aticle-src').innerText;
		item.date = doc.querySelector('span.sub-time').innerText;
		var video = doc.querySelector("video");
		if (video) {
			item.attachments = [{
				url: video.src,
				title: item.title,
				mimeType: "video/mp4",
				snapshot: false
			}];
		} else {
			item.attachments = [];
		}
		var rows = doc.querySelectorAll("#detail > p");
		var abstract = "";
		const reContent = /\d+月\d+日电/g;
		for (let row of rows) {
			if (row.querySelector("video")) continue;
			abstract += row.innerText;
			if (row.innerText.match(reContent)) {
				break;
			}
		}
		item.abstractNote = abstract;
		item.complete();
	});

	translator.getTranslatorObject(function (trans) {
		trans.itemType = "newspaperArticle";
		trans.doWeb(doc, url);
	});
}

