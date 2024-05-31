import { Builder, By, until } from 'selenium-webdriver';
import { describe, it, before, after } from 'mocha';
// import { strictEqual } from 'assert';

describe('Login Screen UI Test Suite', function () {
    let driver;

    // Set up the WebDriver before running the test suite
    before(async function () {
        this.timeout(30000); // Increase timeout to 30 seconds
        driver = await new Builder().forBrowser('firefox').build(); // Using Firefox instead of Chrome
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

        // Click the "Add Card" button
        await detailButton.click();

        // New screen
        await driver.wait(until.urlIs("http://localhost/cards/663afc13561d69e8440ef519"), 10000);
        await driver.get("http://localhost/cards/663afc13561d69e8440ef519");

        await driver.sleep(2000);

        // Locate the paragraph element and wait until it is visible
        const cardTitleElement = await driver.wait(until.elementLocated(By.css('.card-title.h5')), 10000);
        await driver.wait(until.elementIsVisible(cardTitleElement), 10000);

        // Locate the parent of the card title element
        const cardBodyElement = await cardTitleElement.findElement(By.xpath('..'));

        // Locate the paragraph element containing the amount within the same parent
        const paragraph = await cardBodyElement.findElement(By.css('.responsive-text.card-text'));

        const amountText = await paragraph.getText();
        const currentAmount = parseInt(amountText.replace(/[^0-9]/g, ''));

        // Click on button for pay now
        const payButton = await driver.wait(until.elementLocated(By.className('btn-outline-success')), 10000);
        await driver.wait(until.elementIsVisible(payButton), 10000);

        // Click the pay now button
        await payButton.click();

        const inpValue = 5;

        if (inpValue < currentAmount) {
            const amtInput = await driver.findElement(By.name('amount'));
            await amtInput.sendKeys(inpValue);

            // Pay
            const paymentButton = await driver.wait(until.elementLocated(By.className('btn-success')), 10000);
            await driver.wait(until.elementIsVisible(paymentButton), 10000);
            await paymentButton.click();

            // Subtract the entered amount from the current amount
            const newAmount = currentAmount - inpValue;
            const newAmountText = `₹ ${newAmount}.00`;

            // Execute JavaScript to update the value of the paragraph
            await driver.executeScript("arguments[0].innerText = arguments[1];", paragraph, newAmountText);
        }

        await driver.wait(until.urlIs("http://localhost/cards/663afc13561d69e8440ef519"), 10000);
        await driver.get("http://localhost/cards/663afc13561d69e8440ef519");

        await driver.sleep(3000);

        // Logout
        const downToggle = await driver.wait(until.elementLocated(By.id('username')), 10000);
        await driver.wait(until.elementIsVisible(downToggle), 10000);

        // Click the dropdown toggle
        await downToggle.click();

        // Wait until the dropdown menu is visible
        const downMenu = await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 10000);
        await driver.wait(until.elementIsVisible(downMenu), 10000);

        // Find and click the "logout" link in the dropdown
        const logoutLink = await downMenu.findElement(By.css('a[data-rr-ui-dropdown-item][href="#"]'));
        await logoutLink.click();
    });
});
