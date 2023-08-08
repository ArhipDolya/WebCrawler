const {normalizeURL} = require('./crawl.js');
const {test, expect} = require("@jest/globals")

test("normalizeURL", () => {
    const URL = 'HTTP://example.com/PaTh//';
    const output = normalizeURL(URL);
    const expected = "http://example.com/path//"
    expect(output).toEqual(expected)
})