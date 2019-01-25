"use strict"

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