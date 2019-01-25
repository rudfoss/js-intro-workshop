export const findAncestor = (el, match) => {
	let current = el.parentElement
	while (current && !current.matches(match)) {
		current = current.parentElement
	}
	return current
}