
let BG_COLOR = "#000000";
let TEXT_COLOR = "#FFFFFF";

let PAGE_ID = {
	GIFS: 1,
	PROJECTS: 2,
	CONTACT: 3,
	CV: 4,
}

function init_page(page_id, page_html) {
	let body = document.body;
	let body_style = "";
	body_style += "margin: 0px; padding: 0px;";
	body_style += "background-color: " + BG_COLOR + ";";
	body_style += "color: " + TEXT_COLOR + ";";
	body_style += "font-family: Quattrocento;";
	body.setAttribute("style", body_style);

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
		// if(url.length > 0) {
		// 	if(url[url.length - 1] == '/') {
		// 		url += "index.html";
		// 	}
		// }

		let style = "text-decoration: none; color: " + TEXT_COLOR + ";";
		if(pages[i].id === page_id) {
			style += " font-weight: bold;";
		}

		html += "<a href=\"" + url + "\" style=\"" + style + "\">";
		html += pages[i].label;
		html += "</a>";
	}

	html += "</div>";
	html += "<div style=\"padding-bottom: 30px;\"></div>";

	html += page_html;

	body.innerHTML = html;
}