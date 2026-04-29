export class MockSerpCollector {
    async collect(query, country, language) {
        return {
            query,
            country,
            language,
            collectedAt: new Date().toISOString(),
            organicResults: [
                {
                    url: `https://example.com/${query.replace(/\s+/g, '-')}`,
                    title: `Best ${query} Guide`,
                    snippet: `This is a comprehensive guide about ${query}. Learn everything you need to know.`,
                    position: 1,
                    domain: 'example.com',
                }
            ],
            serpFeatures: ['FeaturedSnippet'],
            peopleAlsoAsk: [`What is ${query}?`, `How to use ${query}?`],
            relatedSearches: [`${query} tutorial`, `${query} examples`],
        };
    }
}
