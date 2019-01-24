"use strict"

const tocModule = (() => {
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

	const createTOC = (articleData) => {
		const tocEl = document.createElement("ol")
		tocEl.setAttribute("data-toc", "true")
		articleData.map(createTOCNode).forEach(el => tocEl.appendChild(el))
		return tocEl
	}

	return {
		createTOC
	}
})()