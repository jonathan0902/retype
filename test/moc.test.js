// Load dependecies
var assert = require('chai').assert,
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
const {Builder, By, until} = require('selenium-webdriver');
let driver;

// Our test
describe('Get Hostname', function () {
    
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

    it('Click on link', function (done) {
        // Find title and assert
        driver.executeScript('return window.location;').then(function(return_value) {
            assert.equal(return_value.hostname, 'localhost');
        });
        done();
    });
});