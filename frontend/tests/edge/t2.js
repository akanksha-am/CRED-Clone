import { Builder, By, until } from 'selenium-webdriver';
import { describe, it, before, after } from 'mocha';

describe('Login Screen UI Test Suite', function () {
    let driver;

    // Set up the WebDriver before running the test suite
    before(async function () {
        this.timeout(30000); // Increase timeout to 30 seconds
        driver = await new Builder().forBrowser('chrome').build();
        driver.manage().window().maximize();
    });

    // Close the WebDriver after running the test suite
    after(async function () {
        this.timeout(10000); // Increase timeout to 10 seconds for cleanup
        if (driver) {
            await driver.quit();
        }
    });

    it('should login with valid credentials and navigate to profile', async function () {
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
        await loginButton.click();

        // Wait until the profile link is visible
        const profileLink = await driver.wait(until.elementLocated(By.css('a[href="/profile"]')), 10000);
        await profileLink.click();
    });

    it('should logout and navigate to home page', async function () {
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the profile page
        await driver.get('http://localhost:80/profile');

        // Click the logout button
        const logoutButton = await driver.wait(until.elementLocated(By.id('logout')), 10000);
        await logoutButton.click();

        // Wait until the login page is visible
        await driver.wait(until.urlIs('http://localhost/login'), 10000);

        // Navigate to the home page
        await driver.get('http://localhost/');
    });

    it('should login with different credentials and add a card', async function () {
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the login page
        await driver.get('http://localhost:80/login');

        // Fill in the login form with different credentials
        const emailInput = await driver.findElement(By.name('email'));
        const passwordInput = await driver.findElement(By.name('password'));
        await emailInput.sendKeys('2@gmail.com'); // Adjust with valid test credentials
        await passwordInput.sendKeys('password'); // Adjust with valid test credentials

        // Submit the login form
        const loginButton = await driver.findElement(By.id('login'));
        await loginButton.click();

        // Wait until the profile link is visible
        const profileLink = await driver.wait(until.elementLocated(By.css('a[href="/profile"]')), 10000);
        await profileLink.click();

        // Click the "Add Card" button
        const addCardButton = await driver.wait(until.elementLocated(By.css('a[href="/cards/add/new"]')), 10000);
        await addCardButton.click();

        // Fill in the card details
        const cardNumberInput = await driver.findElement(By.name('cardNumber'));
        const cardHolderInput = await driver.findElement(By.name('cardHolder'));
        const expirationMonthInput = await driver.findElement(By.name('cardMonth'));
        const expirationYearInput = await driver.findElement(By.name('cardYear'));
        const cvvInput = await driver.findElement(By.name('cardCvv'));
        
        await cardNumberInput.sendKeys('4347699988887777'); // Adjust with test data
        await cardHolderInput.sendKeys('Akanksha'); // Adjust with test data
        await expirationMonthInput.sendKeys('01'); // Adjust with test data
        await expirationYearInput.sendKeys('26'); // Adjust with test data
        await cvvInput.sendKeys('555'); // Adjust with test data

        // Submit the card form
        const submitButton = await driver.findElement(By.css('button.btn.btn-primary[type="submit"]'));
        await submitButton.click();

        await driver.sleep(2000);
        // Wait until the profile link is visible again
        await driver.wait(until.urlIs('http://localhost/profile'), 10000);
        await driver.get('http://localhost/profile');
    });
});
