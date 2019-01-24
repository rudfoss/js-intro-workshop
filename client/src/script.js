"use strict"

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

const redrawTOC = () => {
	const currentTOCEl = document.querySelector("[data-toc]")
	const newTOC = tocModule.createTOC(findArticleData())

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
	let actionTarget =
		evt.target.matches("[data-action]") ? evt.target :
		findAncestor(evt.target, "[data-action]")

	if (!actionTarget) {
		return
	}

	const action = actionTarget.getAttribute("data-action")
	if (action === "summarize") {
		summarize()
	}
}
document.body.addEventListener("click", globalActionOnClickHandler)

redrawTOC()