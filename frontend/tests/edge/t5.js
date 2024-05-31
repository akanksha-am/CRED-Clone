import { Builder, By, until } from 'selenium-webdriver';
import { describe, it, before, after } from 'mocha';

describe('Login Screen UI Test Suite in Edge', function () {
    let driver;

    // Set up the WebDriver before running the test suite
    before(async function () {
        this.timeout(30000); // Increase timeout to 30 seconds
        driver = await new Builder().forBrowser('MicrosoftEdge').build();
        driver.manage().window().maximize();
    });

    // Close the WebDriver after running the test suite
    after(async function () {
        this.timeout(10000); // Increase timeout to 10 seconds for cleanup
        if (driver) {
            await driver.quit();
        }
    });

    it('should login with valid credentials', async function () {
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the login page
        await driver.get('http://localhost:80/login');

        // Fill in the login form with valid credentials
        const emailInput = await driver.findElement(By.name('email'));
        const passwordInput = await driver.findElement(By.name('password'));
        await emailInput.sendKeys('1@gmail.com'); // Adjust with valid test credentials
        await passwordInput.sendKeys('password'); // Adjust with valid test credentials

        // Submit the login form
        const loginButton = await driver.findElement(By.id('login'));
        await driver.sleep(2000); // Optional sleep to observe the click action
        await loginButton.click();
        console.log('clicked');
        await driver.wait(until.urlIs("http://localhost/"), 10000);
        await driver.get("http://localhost/");

        // Wait until the dropdown toggle is present and clickable
        const dropdownToggle = await driver.wait(until.elementLocated(By.id('username')), 10000);
        await driver.wait(until.elementIsVisible(dropdownToggle), 10000);

        // Click the dropdown toggle
        await dropdownToggle.click();

        // Wait until the dropdown menu is visible
        const dropdownMenu = await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 10000);
        await driver.wait(until.elementIsVisible(dropdownMenu), 10000);

        // Find and click the "Profile" link in the dropdown
        const profileLink = await dropdownMenu.findElement(By.css('a[href="/profile"]'));
        await profileLink.click();

        // Move to profile page
        await driver.wait(until.urlIs("http://localhost/profile"), 10000);
        await driver.get("http://localhost/profile");

        // Click on DETAILS
        const detailButton = await driver.wait(until.elementLocated(By.id('detail')), 10000);
        await driver.wait(until.elementIsVisible(detailButton), 10000);
        await detailButton.click();

        // New screen
        await driver.wait(until.urlIs("http://localhost/cards/663afc13561d69e8440ef519"), 10000);
        await driver.get("http://localhost/cards/663afc13561d69e8440ef519");

        // Select year, month
        const yearSelect = await driver.wait(until.elementLocated(By.css('.card-input__input.-select')), 10000);
        await driver.wait(until.elementIsVisible(yearSelect), 10000);
        await yearSelect.click();

        const desiredYear = '2024';
        const yearOption = await driver.wait(until.elementLocated(By.xpath(`//option[@value='${desiredYear}']`)), 10000);
        await driver.wait(until.elementIsVisible(yearOption), 10000);
        await yearOption.click();

        const monthSelect = await driver.wait(until.elementLocated(By.css('.card-input__input.-select')), 10000);
        await driver.wait(until.elementIsVisible(monthSelect), 10000);
        await monthSelect.click();

        const desiredMonth = '05';
        const monthOption = await driver.wait(until.elementLocated(By.xpath(`//option[@value='${desiredMonth}']`)), 10000);
        await driver.wait(until.elementIsVisible(monthOption), 10000);
        await monthOption.click();

        // Smart button
        const smartButton = await driver.wait(until.elementLocated(By.css('a[href="/cards/663afc13561d69e8440ef519/smartstatements/2024/5"]')), 10000);
        await driver.wait(until.elementIsVisible(smartButton), 10000);
        await smartButton.click();

        const graph1Button = await driver.wait(until.elementLocated(By.className('btn-outline-info btn-sm')), 10000);
        await driver.wait(until.elementIsVisible(graph1Button), 10000);
        await graph1Button.click();

        const graph2Button = await driver.wait(until.elementLocated(By.className('btn-outline-info btn-sm')), 10000);
        await driver.wait(until.elementIsVisible(graph2Button), 10000);
        await graph2Button.click();

        await driver.sleep(2000);
    });
});
