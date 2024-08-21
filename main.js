const app = document.querySelector('.app')

const searchBlock = document.createElement('div')
searchBlock.classList.add('search-block')

const dropdownMenu = document.createElement('div')
dropdownMenu.classList.add('search-block__dropdown-menu')

const searchInput = document.createElement('input')
searchInput.classList.add('search-block__input')
searchInput.placeholder = 'Search for repositories...'

const dropdownContainer = document.createElement('div')
dropdownContainer.classList.add('search-block__dropdown-container')

const repoCardContainer = document.createElement('div')
repoCardContainer.classList.add('repo-card__container')

dropdownMenu.append(searchInput, dropdownContainer)
searchBlock.append(dropdownMenu, repoCardContainer)
app.append(searchBlock)

function clearInput() {
	searchInput.value = ''
}

function clearDropdown() {
	dropdownContainer.textContent = ''
}

const debounce = (fn, debounceTime) => {
	let timer
	return function (...args) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, debounceTime)
	}
}

const addCard = item => {
	let name = item.name
	let owner = item.owner.login
	let stars = item.stargazers_count

	const repoCard = document.createElement('div')
	repoCard.classList.add('repo-card')

	const infoContainer = document.createElement('div')
	infoContainer.classList.add('repo-card__info')

	const nameElement = document.createElement('p')
	nameElement.classList.add('repo-card__info-item')
	nameElement.textContent = `Name: ${name}`

	const ownerElement = document.createElement('p')
	ownerElement.textContent = `Owner: ${owner}`
	ownerElement.classList.add('repo-card__info-item')

	const starsElement = document.createElement('p')
	starsElement.textContent = `Stars: ${stars}`
	starsElement.classList.add('repo-card__info-item')

	const closeButton = document.createElement('button')
	closeButton.classList.add('repo-card__close-btn')

	infoContainer.append(nameElement, ownerElement, starsElement)
	repoCard.append(infoContainer, closeButton)

	repoCardContainer.append(repoCard)

	const removeCard = () => {
		repoCard.remove()
		closeButton.removeEventListener('click', removeCard)
	}

	closeButton.addEventListener('click', removeCard)

	clearInput()
	clearDropdown()
}

const getRepos = async request => {
	try {
		if (!request.trim()) {
			clearDropdown()
			return
		}

		const response = await fetch(
			`https://api.github.com/search/repositories?q=${request}`,
			{
				headers: {
					'X-GitHub-Api-Version': '2022-11-28',
				},
			}
		)

		if (!response.ok) {
			throw new Error(`Failed to fetch data. Status: ${response.status}`)
		}

		const responseJson = await response.json()
		clearDropdown()
		const items = responseJson.items.slice(0, 5)

		if (items.length === 0) {
			dropdownContainer.classList.add(
				'search-block__dropdown-container--no-results'
			)
			dropdownContainer.insertAdjacentHTML('beforeend', '<p>No results... </p>')
		} else {
			const handleChoiceClick = item => {
				addCard(item)
			}

			items.forEach(item => {
				const choice = document.createElement('p')
				choice.className = 'search-block__dropdown-item'
				choice.textContent = `${item.name}`
				choice.addEventListener('click', () => handleChoiceClick(item))
				dropdownContainer.append(choice)
			})
		}
	} catch (error) {
		console.error('Error during fetch:', error.message)
		dropdownContainer.insertAdjacentHTML(
			'beforeend',
			`<p class="search-block__error-message">Error fetching data: ${error.message}</p>`
		)
	}
}

const debounceGetRepos = debounce(getRepos, 900)

const handleInputChange = () => {
	const inputValue = searchInput.value.trim()
	if (inputValue === '' || inputValue.includes(' ')) {
		clearDropdown()
		return
	}
	debounceGetRepos(inputValue)
}

searchInput.addEventListener('input', handleInputChange)
