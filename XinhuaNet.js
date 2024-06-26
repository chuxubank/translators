{
	"translatorID": "8c5be9da-70d4-4629-9d11-92ab3f9cb8ee",
	"label": "XinhuaNet",
	"creator": "Misaka",
	"target": "^https?://(www\\.)?(news\\.cn|xinhuanet\\.com)",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2024-03-23 07:06:04"
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
		item.section = "Politics";
		var title = text(doc, "div.h-title");
		if (!title) title = text(doc, "span.title");
		item.title = title;
		item.publicationTitle = text(doc, "span.aticle-src");
		var date = text(doc, "span.sub-time");
		if (!date) date = text(doc, "span.h-time");
		if (!date) date = text(doc, "span.year > em") +
						  '/' +
						  text(doc, "span.day") +
						  ' ' +
						  text(doc, "span.time");
		item.date = date;
		item.attachments = [];
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

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://www.xinhuanet.com/politics/2021-11/16/c_1128069845.htm",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "（受权发布）习近平：关于《中共中央关于党的百年奋斗重大成就和历史经验的决议》的说明",
				"creators": [],
				"date": "2021-11-16 17:02:35",
				"abstractNote": "新华社北京11月16日电",
				"libraryCatalog": "www.xinhuanet.com",
				"publicationTitle": "新华网",
				"section": "Politics",
				"url": "http://www.xinhuanet.com/politics/2021-11/16/c_1128069845.htm",
				"attachments": [],
				"tags": [
					{
						"tag": "习近平"
					},
					{
						"tag": "六中全会"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.news.cn/politics/leaders/2021-11/24/c_1128096690.htm",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "习近平主持召开中央全面深化改革委员会第二十二次会议",
				"creators": [],
				"date": "2021-11-24 19:08:51",
				"abstractNote": "习近平主持召开中央全面深化改革委员会第二十二次会议强调加快科技体制改革攻坚建设全国统一电力市场体系　建立中小学校党组织领导的校长负责制李克强王沪宁韩正出席　　新华社北京11月24日电 中共中央总书记、国家主席、中央军委主席、中央全面深化改革委员会主任习近平11月24日下午主持召开中央全面深化改革委员会第二十二次会议，审议通过了《科技体制改革三年攻坚方案（2021－2023年）》、《关于加快建设全国统一电力市场体系的指导意见》、《关于建立中小学校党组织领导的校长负责制的意见（试行）》、《关于让文物活起来、扩大中华文化国际影响力的实施意见》、《关于支持中关村国家自主创新示范区开展高水平科技自立自强先行先试改革的若干措施》。",
				"libraryCatalog": "www.news.cn",
				"publicationTitle": "新华网",
				"section": "Politics",
				"url": "http://www.news.cn/politics/leaders/2021-11/24/c_1128096690.htm",
				"attachments": [],
				"tags": [
					{
						"tag": "习近平"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.news.cn/politics/leaders/2021-11/03/c_1128026941.htm",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "中共中央国务院隆重举行国家科学技术奖励大会 习近平出席大会并为最高奖获得者等颁奖 李克强讲话 王沪宁出席 韩正主持",
				"creators": [],
				"date": "2021-11-03 16:46:12",
				"abstractNote": "11月3日，2020年度国家科学技术奖励大会在北京人民大会堂隆重举行。会前，党和国家领导人习近平、李克强、王沪宁、韩正等会见获奖代表并同大家合影留念。新华社记者 李学仁 摄　　新华社北京11月3日电 中共中央、国务院3日上午在北京隆重举行国家科学技术奖励大会。习近平、李克强、王沪宁、韩正等党和国家领导人出席大会并为获奖代表颁奖。李克强代表党中央、国务院在大会上讲话。韩正主持大会。",
				"libraryCatalog": "www.news.cn",
				"publicationTitle": "新华网",
				"section": "Politics",
				"url": "http://www.news.cn/politics/leaders/2021-11/03/c_1128026941.htm",
				"attachments": [],
				"tags": [
					{
						"tag": "习近平"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.xinhuanet.com/politics/2021-11/11/c_1128055386.htm",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "（受权发布）中国共产党第十九届中央委员会第六次全体会议公报",
				"creators": [],
				"date": "2021/11/11 18:12:02",
				"abstractNote": "新华社北京11月11日电",
				"libraryCatalog": "www.xinhuanet.com",
				"section": "Politics",
				"url": "http://www.xinhuanet.com/politics/2021-11/11/c_1128055386.htm",
				"attachments": [],
				"tags": [
					{
						"tag": "六中全会"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.news.cn/politics/leaders/20240323/04dac3f6f5f744d3bed21b5fc9382d48/c.html",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "习近平就俄罗斯发生严重恐怖袭击事件向俄罗斯总统普京致慰问电",
				"creators": [],
				"date": "2024/03/23 13:35:08",
				"abstractNote": "习近平就俄罗斯发生严重恐怖袭击事件向俄罗斯总统普京致慰问电-3月23日，国家主席习近平就俄罗斯莫斯科州一音乐厅发生严重恐怖袭击事件造成重大人员伤亡向俄罗斯总统普京致慰问电。",
				"libraryCatalog": "www.news.cn",
				"section": "Politics",
				"url": "http://www.news.cn/politics/leaders/20240323/04dac3f6f5f744d3bed21b5fc9382d48/c.html",
				"attachments": [],
				"tags": [
					{
						"tag": "政治"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/
