const {normalizeURL} = require('./crawl.js');
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