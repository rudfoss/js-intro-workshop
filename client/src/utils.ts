export const findAncestor = (el: HTMLElement, match: string) => {
	let current: HTMLElement | null = el
	while (current && !current.matches(match)) {
		current = current.parentElement
	}

	return current
}

export const debounce = <T = any>(func: (...args: any[]) => T, delay: number) => {
	let timeoutId: number | undefined
	return (...args: any[]) => {
		if (timeoutId) clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			func(...args)
		}, delay)
	}
}