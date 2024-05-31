import { Builder, By, until } from 'selenium-webdriver';
import { describe, it, before, after } from 'mocha';

describe('Login Screen UI Test Suite in Edge', function () {
    let driver;

    // Set up the WebDriver before running the test suite
    before(async function () {
        this.timeout(30000); // Increase timeout to 30 seconds
        driver = await new Builder()
            .forBrowser('MicrosoftEdge')
            .build();
        driver.manage().window().maximize();
    });

    // Close the WebDriver after running the test suite
    after(async function () {
        this.timeout(10000); // Increase timeout to 10 seconds for cleanup
        if (driver) {
            await driver.quit();
        }
    });

    // Test case: Register with valid credentials
    it('should register with valid credentials', async function () {
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the login page
        await driver.get('http://localhost:80/login');

        const registerLink = await driver.findElement(By.linkText('Register'));
        await registerLink.click();

        await driver.wait(until.urlIs("http://localhost/register"), 10000);
        await driver.get("http://localhost/register");

        // Find the form elements and input the test data
        await driver.findElement(By.name('name')).sendKeys('Test2');
        await driver.findElement(By.name('email')).sendKeys('test2@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('password');
        await driver.findElement(By.name('confirmPassword')).sendKeys('password');

        // Submit the form
        const registerButton = await driver.findElement(By.id('register'));
        await driver.sleep(2000);
        await registerButton.click();

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
    });

    it('should navigate to profile', async function () {
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the initial screen where the form is located
        await driver.sleep(2000);

        // Verify that the new URL is correct
        await driver.wait(until.urlIs('http://localhost/profile'), 10000);
        await driver.get('http://localhost/profile')

        // Wait until the "Add Card" button is present and clickable
        const addCardButton = await driver.wait(until.elementLocated(By.css('a[href="/cards/add/new"]')), 10000);
        await driver.wait(until.elementIsVisible(addCardButton), 10000);

        // Click the "Add Card" button
        await addCardButton.click();


    });


    it('should navigate to "cards/add/new" screen after form submission', async function () {
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the initial screen where the form is located
        await driver.sleep(2000);
        await driver.wait(until.urlIs('http://localhost/cards/add/new'), 10000);
        await driver.get('http://localhost/cards/add/new');

        // Find form elements and fill them
        const cardNumberInput = await driver.findElement(By.name('cardNumber'));
        await cardNumberInput.sendKeys('3566000020000410'); // Adjust with test data

        const cardHolderInput = await driver.findElement(By.name('cardHolder'));
        await cardHolderInput.sendKeys('Akanksha'); // Adjust with test data

        const expirationMonthInput = await driver.findElement(By.name('cardMonth'));
        await expirationMonthInput.sendKeys('02'); // Adjust with test data

        const expirationYearInput = await driver.findElement(By.name('cardYear'));
        await expirationYearInput.sendKeys('26');

        const cvvInput = await driver.findElement(By.name('cardCvv'));
        await cvvInput.sendKeys('123');

        await (await driver.findElement(By.css('button.btn.btn-primary[type="submit"]'))).click();

    });

    it('should navigate to profile screen after form submission', async function () {
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the initial screen where the form is located
        await driver.sleep(2000);

        // Verify that the new URL is correct
        await driver.wait(until.urlIs('http://localhost/profile'), 10000);
        await driver.get('http://localhost/profile');

    });
});
