const { parse } = require('url');
const {JSDOM} = require('jsdom');
const axios = require('axios')


async function crawlingPage(baseURL) {
    try{
        const responce = await fetch(baseURL)
        console.log(await responce.text())
    } catch (error) {
        console.log(`There is an error in fetch ${error.message} on page ${baseURL}`)
    }
    

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






