const { crawlingPages } = require('./crawl.js')

async function main() {
    if (process.argv.length < 3) {
        console.log('There is no website')
        process.exit(1)
    } 

    const baseURL = process.argv[2]

    console.log(`Start crawling ${baseURL}`)
    const pages = await crawlingPages(baseURL, [baseURL], {}, 0)

    console.log('Crawling Results:');
    console.table(Object.entries(pages).map(([url, count]) => ({ URL: url, Occurrences: count })));
}

main();