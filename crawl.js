const { parse } = require('url');
const {JSDOM} = require('jsdom');
const axios = require('axios')
const robotsParser = require('robots-parser')


const depthLimit = 5


async function crawlingPages(baseURL, currentURLs, pages, currentDepth) {
    const promises = currentURLs.map(async currentURL => {

        if (currentDepth >= depthLimit) {
            console.log(`Reached depth limit at ${currentURL}`)
            return pages;
        }

        const userAgentList = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            ];

        const baseURLObj = new URL(baseURL);
        const currentURLObj = new URL(currentURL);

        const randomUserAgent = userAgentList[Math.floor(Math.random() * userAgentList.length)]

        const robotsTxtParser = new robotsParser(`${baseURLObj.protocol}//${baseURLObj.hostname}/robots.txt`)

        if (!robotsTxtParser.isAllowed(currentURL, '*')) {
            console.log(`Crawling not allowed for ${currentURL}`);
            return pages;
        }

        if (baseURLObj.hostname !== currentURLObj.hostname) {
            return pages;
        }

        const normalizedCurrentURL = normalizeURL(currentURL);

        if (pages[normalizedCurrentURL] > 0) {
            pages[normalizedCurrentURL]++;
            return pages;
        }

        pages[normalizedCurrentURL] = 1;

        console.log(`Active crawling: ${currentURL}`);

        try {
            const response = await fetch(currentURL);

            const userAgentResponce = await axios.get(currentURL, {
                headers: {
                    "User-Agent": randomUserAgent,
                },
            })

            if (response.status > 399) {
                console.log(`Error in fetch with status code: ${response.status} on page ${currentURL}`);
                return pages;
            }

            const contentType = response.headers.get('content-type');

            if (!contentType.includes('text/html')) {
                console.log(`It's not an HTML response, content type: ${contentType} on page: ${currentURL}`);
                return pages;
            }

            const htmlBody = await response.text();

            const URLs = getUrlsFromHtml(htmlBody, baseURL);

            for (const url of URLs) {
                pages = await crawlingPages(baseURL, [url], pages, currentDepth + 1);
            }

        } catch (error) {
            console.log(`There is an error in fetch ${error.message} on page ${currentURL}`);
        }

        return pages;
    });

    return Promise.all(promises).then(results => results.reduce((merged, result) => ({ ...merged, ...result }), {}));
}


function getUrlsFromHtml(HTMLBody, baseURL) {
    const { window } = new JSDOM(HTMLBody, { url: baseURL });
    const document = window.document;

    const urls = [];

    const anchorElements = document.querySelectorAll('a');

    anchorElements.forEach(anchor => {
        const href = anchor.getAttribute('href');
        
        if (href) {
            try {
                const resolvedURL = new URL(href, baseURL).toString();
                urls.push(resolvedURL);
            } catch (error) {
                
            }
        }
    });

    return urls;
}


function normalizeURL(URLString) {
    try {
        const urlObject = parse(URLString);
        const normalizedHostname = urlObject.hostname.toLowerCase();
        const normalizedPathname = urlObject.pathname.replace(/\/+$/, '');
        const normalizedURL = `${normalizedHostname}${normalizedPathname}`;
        return normalizedURL;
    } catch (error) {
        console.error('Invalid URL:', URLString);
        return null;
    }
}


module.exports = {
    normalizeURL,
    getUrlsFromHtml,
    crawlingPages,
}






