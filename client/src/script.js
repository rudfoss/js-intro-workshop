"use strict"

const changeTitle = (newTitle) => {
	document.querySelector("title").textContent = newTitle
}

const enforceIngress = () => {
	const paragraphEls = document.querySelectorAll("article p:first-of-type")
	for (const el of paragraphEls) {
		el.classList.add("ingress")
	}
}
const summarize = () => {
	const nonIngressParagraphEls = document.querySelectorAll("article p:not(:first-of-type)")
	for (const el of nonIngressParagraphEls) {
		el.parentElement.removeChild(el)
	}
}

const createSummarizer = () => {
	const sectionEl = document.querySelector("section")
	const asideEl = document.createElement("aside")
	const summarizeButtonEl = document.createElement("button")

	summarizeButtonEl.textContent = "Summarize"
	summarizeButtonEl.setAttribute("data-action", "summarize")
	asideEl.appendChild(summarizeButtonEl)

	sectionEl.insertBefore(asideEl, sectionEl.firstChild)
}
createSummarizer()

const findArticleData = () => {
	const ingressEls = document.querySelectorAll("article p:first-of-type")
	return Array.from(ingressEls).map((ingressEl, idx) => {
		const articleId = "article-"+idx
		const articleHeadingEl = ingressEl.previousElementSibling
		articleHeadingEl.setAttribute("id", articleId)

		return {
			id: articleId,
			title: articleHeadingEl.textContent,
			ingressFirstSentence: ingressEl.textContent.split(".")[0]+"."
		}
	})
}

const createTOCNode = (articleTOC) => {
	const itemEl = document.createElement("li")
	const linkEl = document.createElement("a")
	const itemTitleEl = document.createElement("strong")
	const itemIngressEl = document.createElement("span")

	linkEl.setAttribute("href", "#"+articleTOC.id)
	linkEl.addEventListener("click", smoothScrollOnClick)

	itemTitleEl.textContent = articleTOC.title
	itemIngressEl.textContent = " - "+articleTOC.ingressFirstSentence

	linkEl.appendChild(itemTitleEl)
	linkEl.appendChild(itemIngressEl)
	itemEl.appendChild(linkEl)

	return itemEl
}

const createTOC = () => {
	const tocEl = document.createElement("ol")
	tocEl.setAttribute("data-toc", "true")
	findArticleData().map(createTOCNode).forEach(el => tocEl.appendChild(el))
	return tocEl
}

const redrawTOC = () => {
	const currentTOCEl = document.querySelector("[data-toc]")
	const newTOC = createTOC()

	if (currentTOCEl) {
		currentTOCEl.replaceWith(newTOC)
		return
	}

	document.body.appendChild(newTOC)
}

const smoothScrollOnClick = (evt) => {
	evt.preventDefault()
	const id = evt.currentTarget.getAttribute("href")
	const scrollTargetEl = document.querySelector(id)
	scrollTargetEl.scrollIntoView({ behavior: "smooth", block: "start" })
	history.pushState({}, id, id)
}

const globalActionOnClickHandler = (evt) => {
	if (!evt.target.matches("[data-action]")) {
		return
	}

	const action = evt.target.getAttribute("data-action")
	if (action === "summarize") {
		summarize()
	}
}
document.body.addEventListener("click", globalActionOnClickHandler)

redrawTOC()