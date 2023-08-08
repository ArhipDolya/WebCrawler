const {normalizeURL, getUrlsFromHtml} = require('./crawl.js');
const {test, expect} = require("@jest/globals")

test("normalizeURL", () => {
    const URL = 'https://blog.boot.dev/path';
    const output = normalizeURL(URL);
    const expected = "blog.boot.dev/path"
    expect(output).toEqual(expected)
})

test("normalizeURL", () => {
    const URL = 'https://blog.boot.dev/path/';
    const output = normalizeURL(URL);
    const expected = "blog.boot.dev/path"
    expect(output).toEqual(expected)
})

test("normalizeURL Capitals", () => {
    const URL = 'https://BLOG.boot.dev/path/';
    const output = normalizeURL(URL);
    const expected = "blog.boot.dev/path"
    expect(output).toEqual(expected)
})

test("normalizeURL Capitals", () => {
    const URL = 'http://BLOG.boot.dev/path/';
    const output = normalizeURL(URL);
    const expected = "blog.boot.dev/path"
    expect(output).toEqual(expected)
})

test("getUrlsFromHtml", () => {
    const htmlContent = `
    <html>
        <body>
            <a href="https://baseurl.com">Example</a>
            <a href="/path">Relative Path</a>
            <a href="mailto:info@example.com">Email</a>
        </body>
    </html>
    `;
    const baseURL = 'https://baseurl.com'
    const output = getUrlsFromHtml(htmlContent, baseURL);
    const expected = ['https://baseurl.com']
    expect(output).toEqual(expected)
})