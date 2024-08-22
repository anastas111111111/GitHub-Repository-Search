class GitHubView {
    constructor(container) {
        this.container = container;
        this.initDOM();
    }

    initDOM() {
        this.searchBlock = this.createElement('div', { class: 'search-block' });
        this.dropdownMenu = this.createElement('div', {
            class: 'search-block__dropdown-menu',
        });
        this.searchInput = this.createElement('input', {
            class: 'search-block__input',
            placeholder: 'Search for repositories...',
        });
        this.dropdownContainer = this.createElement('div', {
            class: 'search-block__dropdown-container',
        });
        this.repoCardContainer = this.createElement('div', {
            class: 'repo-card__container',
        });

        this.dropdownMenu.append(this.searchInput, this.dropdownContainer);
        this.searchBlock.append(this.dropdownMenu, this.repoCardContainer);
        this.container.append(this.searchBlock);
    }

    createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                value.split(' ').forEach(cls => element.classList.add(cls));
            } else {
                element.setAttribute(key, value);
            }
        });
        return element;
    }

    clearInput() {
        this.searchInput.value = '';
    }

    clearDropdown() {
        this.dropdownContainer.textContent = '';
    }

    renderRepositories(repos, onSelect) {
        this.clearDropdown();
        repos.forEach(repo => {
            const choice = this.createElement('p', {
                class: 'search-block__dropdown-item',
            });
            choice.textContent = repo.name;
            choice.addEventListener('click', () => onSelect(repo));
            this.dropdownContainer.append(choice);
        });
    }

    renderError(message) {
        this.dropdownContainer.insertAdjacentHTML(
            'beforeend',
            `<p class="search-block__error-message">${message}</p>`
        );
    }

    renderCard(repo) {
        const repoCard = this.createElement('div', { class: 'repo-card' });
        const infoContainer = this.createElement('div', {
            class: 'repo-card__info',
        });
        const nameElement = this.createElement('p', {
            class: 'repo-card__info-item',
        });
        nameElement.textContent = `Name: ${repo.name}`;
        const ownerElement = this.createElement('p', {
            class: 'repo-card__info-item',
        });
        ownerElement.textContent = `Owner: ${repo.owner.login}`;
        const starsElement = this.createElement('p', {
            class: 'repo-card__info-item',
        });
        starsElement.textContent = `Stars: ${repo.stargazers_count}`;
        const closeButton = this.createElement('button', {
            class: 'repo-card__close-btn',
        });

        infoContainer.append(nameElement, ownerElement, starsElement);
        repoCard.append(infoContainer, closeButton);
        this.repoCardContainer.append(repoCard);

        closeButton.addEventListener('click', () => {
            repoCard.remove();
        });
    }
}

export default GitHubView;