const { parse } = require('url');

function normalizeURL(URLString) {
    try {
        const urlObject = parse(URLString);
        const normalizedURL = `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}`;
        return normalizedURL.toLowerCase();
    } catch (error) {
        console.error('Invalid URL:', URLString);
        return null; 
    }
}


module.exports = {
    normalizeURL,
}