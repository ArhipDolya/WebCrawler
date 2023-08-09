const { crawlingPages } = require('./crawl.js')

async function main() {
    if (process.argv.length < 3) {
        console.log('There is no website')
        process.exit(1)
    } 

    const baseURL = process.argv[2]

    console.log(`Start crawling ${baseURL}`)
    const pages = await crawlingPages(baseURL, [baseURL], {}, 0)

    for (const [url, count] of Object.entries(pages)) { 
        console.log(`${url}: ${count} occurrences`);
    }
}


main()