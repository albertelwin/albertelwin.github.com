
let IS_LOCAL = window.location.protocol === "file:";

let BG_COLOR = "#000000";
let TEXT_COLOR = "#FFFFFF";

let PAGE_ID = {
	GIFS: 1,
	PROJECTS: 2,
	CONTACT: 3,
	CV: 4,
}

function vpad(px) {
	return "<div style=\"padding-bottom: " + px + "px;\"></div>";
}

function begin_hyperlink(url, style) {
	return "<a href=\"" + url + "\" style=\"text-decoration: none; color: " + TEXT_COLOR + "; " + style + "\">";
}

function end_hyperlink(url) {
	return "</a>";
}

function init_body() {
	let body_style = "";
	body_style += "margin: 0px; padding: 0px;";
	body_style += "background-color: " + BG_COLOR + ";";
	body_style += "color: " + TEXT_COLOR + ";";
	body_style += "font-family: Quattrocento;";
	document.body.setAttribute("style", body_style);
}

function init_page(page_id, page_html) {
	init_body();

	let html = "";

	html += "<div style=\"padding-bottom: 30px;\"></div>";
	html += "<div style=\"text-align: center;\">";
	html += "<div style=\"font-size: 48px; font-weight: bold;\">Albert Elwin</div>";
	html += "<div style=\"font-size: 28px;\">Graphics/Engine Programmer</div>";
	html += "<div style=\"padding-bottom: 23px;\"></div>";

	let pages = [
		{ id: PAGE_ID.GIFS, label: "GIFS", url: "../", },
		{ id: PAGE_ID.PROJECTS, label: "PROJECTS", url: "../portfolio/", },
		{ id: PAGE_ID.CONTACT, label: "CONTACT", url: "../contact/", },
		{ id: PAGE_ID.CV, label: "CV", url: "../cv.pdf", },
	];

	html += "<div style=\"display: inline-block; font-size: 14px;\">";
	for(let i = 0; i < pages.length; i++) {
		if(i > 0) {
			html += "\xa0\xa0\xa0\xa0";
			html += "•";
			html += "\xa0\xa0\xa0\xa0";
		}

		let url = pages[i].url;
		if(IS_LOCAL && url.length > 0) {
			if(url[url.length - 1] == '/') {
				url += "index.html";
			}
		}

		let style = "";
		if(pages[i].id === page_id) {
			style = "font-weight: bold;";
		}

		html += begin_hyperlink(url, style);
		html += pages[i].label;
		html += end_hyperlink();
	}

	html += "</div>";
	html += "<div style=\"padding-bottom: 30px;\"></div>";

	html += page_html;

	document.body.innerHTML = html;
}