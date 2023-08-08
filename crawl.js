const { parse } = require('url');
const {JSDOM} = require('jsdom');
const axios = require('axios')
const robotsParser = require('robots-parser')


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function crawlingPages(baseURL, currentURLs, pages) {
    const promises = currentURLs.map(async currentURL => {

        const baseURLObj = new URL(baseURL);
        const currentURLObj = new URL(currentURL);

        const robotsTxtParser = new robotsParser(`${baseURLObj.protocol}//${baseURLObj.hostname}/robots.txt`)

        if (!robotsTxtParser.isAllowed(currentURL, '*')) {
            console.log(`Crawling not allowed for ${currentURL}`);
            return pages;
        }

        await delay(1000)

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
                pages = await crawlingPages(baseURL, [url], pages);
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






