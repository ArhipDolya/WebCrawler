const { crawlingPage } = require('./crawl.js')

function main() {
    if (process.argv.length < 3) {
        console.log('There is no website')
        process.exit(1)
    } 

    const baseURL = process.argv[2]

    console.log(`Start crawling ${baseURL}`)
    crawlingPage(baseURL)
}


main()