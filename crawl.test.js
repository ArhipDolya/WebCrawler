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

test("getUrlsFromHtml absolute", () => {
    const htmlContent = `
    <html>
        <body>
            <a href="https://baseurl.com/path/">
        </body>
    </html>
    `;
    const baseURL = 'https://baseurl.com/path/'
    const output = getUrlsFromHtml(htmlContent, baseURL);
    const expected = ['https://baseurl.com/path/']
    expect(output).toEqual(expected)
})

test("getUrlsFromHtml relative", () => {
    const htmlContent = `
    <html>
        <body>
            <a href="/path/">Example</a>
        </body>
    </html>
    `;
    const baseURL = 'https://baseurl.com'
    const output = getUrlsFromHtml(htmlContent, baseURL);
    const expected = ['https://baseurl.com/path/']
    expect(output).toEqual(expected)
})

test("getUrlsFromHtml multiple", () => {
    const htmlContent = `
    <html>
        <body>
            <a href="https://baseurl.com/path1/">
            <a href="/path2/">Example</a>
        </body>
    </html>
    `;
    const baseURL = 'https://baseurl.com'
    const output = getUrlsFromHtml(htmlContent, baseURL);
    const expected = ['https://baseurl.com/path1/', 'https://baseurl.com/path2/']
    expect(output).toEqual(expected)
})

