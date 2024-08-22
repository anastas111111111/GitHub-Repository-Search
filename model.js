class GitHubModel {
    async searchRepositories(query) {
        try {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${query}`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
            const responseJson = await response.json();
            return responseJson.items.slice(0, 5);
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }
}

export default GitHubModel;