export const findAncestor = (el, match) => {
	let current = el.parentElement
	while (current && !current.matches(match)) {
		current = current.parentElement
	}
	return current
}

export const debounce = (func, delay) => {
	let timeoutId
	return (...args) => {
		if (timeoutId) clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			func(...args)
		}, delay)
	}
}