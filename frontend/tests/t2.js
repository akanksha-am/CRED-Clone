import { Builder, By, until } from 'selenium-webdriver';
import { describe, it, before, after } from 'mocha';
// import { strictEqual } from 'assert';

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
        });

        it('should login with valid credentials', async function () {
            this.timeout(20000); // Increase timeout to 20 seconds for this test
            await driver.sleep(2000);
            // Navigate to the login page
            await driver.get('http://localhost:80/profile');

            const authButton = await driver.wait(until.elementLocated(By.id('authButton')), 10000);
            await driver.wait(until.elementIsVisible(authButton), 10000);

            // Click the button containing auth code
            await authButton.click();


            // to get the auth code
            const authCodeInput = await driver.wait(until.elementLocated(By.id('authCode')), 10000);

            const authCodeText = await authCodeInput.getAttribute('value');

            // Wait until the dropdown toggle is present and clickable
           const dropdownToggle = await driver.wait(until.elementLocated(By.id('username')), 10000);
           await driver.wait(until.elementIsVisible(dropdownToggle), 10000);
           
           // Click the dropdown toggle
           await dropdownToggle.click();
           
           // Wait until the dropdown menu is visible
           const dropdownMenu = await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 10000);
           await driver.wait(until.elementIsVisible(dropdownMenu), 10000);
        
           // Find and click the "Profile" link in the dropdown
           const logoutLink = await dropdownMenu.findElement(By.css('a[data-rr-ui-dropdown-item][href="#"]'));
           await logoutLink.click();

           await driver.wait(until.urlIs("http://localhost/profile"), 10000);
           await driver.get("http://localhost/profile");

            // login
            this.timeout(20000); // Increase timeout to 20 seconds for this test
        
            // Navigate to the login page
            await driver.get('http://localhost:80/login');
            
            // Fill in the login form with valid credentials
            const emailInput = await driver.findElement(By.name('email'));
            const passwordInput = await driver.findElement(By.name('password'));
            await emailInput.sendKeys('2@gmail.com'); // Adjust with valid test credentials
            await passwordInput.sendKeys('password'); // Adjust with valid test credentials
            
            // Submit the login form
            const loginButton = await driver.findElement(By.id('login'));
            await driver.sleep(2000); // Optional sleep to observe the click action
            await loginButton.click();
            console.log('clicked');
            await driver.wait(until.urlIs("http://localhost/"), 10000);
            await driver.get("http://localhost/");

            // goto profile
            // Wait until the dropdown toggle is present and clickable
       const dropToggle = await driver.wait(until.elementLocated(By.id('username')), 10000);
       await driver.wait(until.elementIsVisible(dropToggle), 10000);
       
       // Click the dropdown toggle
       await dropToggle.click();
       
       // Wait until the dropdown menu is visible
       const dropMenu = await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 10000);
       await driver.wait(until.elementIsVisible(dropMenu), 10000);

       // Find and click the "Profile" link in the dropdown
       const profileLink = await dropMenu.findElement(By.css('a[href="/profile"]'));
       await profileLink.click();

    //    add card button click
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

            // add shared card
            this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the initial screen where the form is located
        await driver.sleep(2000);
        await driver.wait(until.urlIs('http://localhost/cards/add/new'), 10000);
        await driver.get('http://localhost/cards/add/new');

        // Find form elements and fill them
        const cardNumberInput = await driver.findElement(By.name('cardNumber'));
        await cardNumberInput.sendKeys('4347699988887777'); // Adjust with test data

        const cardHolderInput = await driver.findElement(By.name('cardHolder'));
        await cardHolderInput.sendKeys('Akanksha'); // Adjust with test data

        const expirationMonthInput = await driver.findElement(By.name('cardMonth'));
        await expirationMonthInput.sendKeys('01'); // Adjust with test data

        const expirationYearInput = await driver.findElement(By.name('cardYear'));
        await expirationYearInput.sendKeys('26'); 

        const cvvInput = await driver.findElement(By.name('cardCvv'));
        await cvvInput.sendKeys('555'); 

        const authInput = await driver.findElement(By.name('authCode'));
        await authInput.sendKeys(authCodeText); 

        await (await driver.findElement(By.css('button.btn.btn-primary[type="submit"]'))).click();

        // goto profile now
        this.timeout(20000); // Increase timeout to 20 seconds for this test

        // Navigate to the initial screen where the form is located
        await driver.sleep(2000);

       // Verify that the new URL is correct
       await driver.wait(until.urlIs('http://localhost/profile'), 10000);
       await driver.get('http://localhost/profile');
        });
    });