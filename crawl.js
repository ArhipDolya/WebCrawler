const { parse } = require('url');
const {JSDOM} = require('jsdom');
const axios = require('axios')


async function crawlingPages(baseURL, currentURL, pages) {

    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
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

    try{
        const responce = await fetch(currentURL)

        if (responce.status > 399) {
            console.log(`Error in fetch with status code: ${responce.status} on page ${currentURL}`)
            return pages
        }

        const contentType = responce.headers.get('content-type')

        if (!contentType.includes('text/html')) {
            console.log(`It's not html responce, content type: ${contentType} on page: ${currentURL}`)
            return pages
        }

        const htmlBody = await responce.text()
        
        const URLs = getUrlsFromHtml(htmlBody, baseURL)

        for (const url of URLs) {
            pages = await crawlingPage(baseURL, url, pages)
        }

    } catch (error) {
        console.log(`There is an error in fetch ${error.message} on page ${currentURL}`)
    }

    return pages;

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
    crawlingPage,
}






