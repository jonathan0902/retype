// Load dependecies
var assert = require('chai').assert,
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
const {Builder, By, until} = require('selenium-webdriver');
let driver;

// Our test
describe('Get Title', function () {
    
    beforeEach(function(done) {
        this.timeout(20000);
        driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.chrome()).
        build();

        driver.get('http://localhost:8080/');
        done();
    });

    afterEach(function(done) {
        driver.close();
        done();
    });

    it('Title should be "me"', function (done) {
        // Find title and assert
        driver.executeScript('return document.title').then(function(return_value) {
            assert.equal(return_value, 'me');
        });
        done();
    });
});