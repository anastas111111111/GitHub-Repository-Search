import GitHubModel from './model.js';
import GitHubView from './view.js';

class GitHubController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.view.searchInput.addEventListener(
            'input',
            this.handleInputChange.bind(this)
        );
    }

    handleInputChange(event) {
        const query = event.target.value.trim();
        if (query === '' || query.includes(' ')) {
            this.view.clearDropdown();
            return;
        }
        this.debouncedSearch(query);
    }

    async searchRepositories(query) {
        try {
            const repos = await this.model.searchRepositories(query);
            if (repos.length === 0) {
                this.view.renderError('No results...');
            } else {
                this.view.renderRepositories(repos, this.addCard.bind(this));
            }
        } catch (error) {
            this.view.renderError(error.message);
        }
    }

    addCard(repo) {
        this.view.renderCard(repo);
        this.view.clearInput();
        this.view.clearDropdown();
    }

    debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    debouncedSearch = this.debounce(this.searchRepositories.bind(this), 1000);
}

const app = document.querySelector('.app');
const model = new GitHubModel();
const view = new GitHubView(app);
const controller = new GitHubController(model, view);