import { Builder, By, until } from 'selenium-webdriver';
import { describe, it, before, after } from 'mocha';

describe('Login Screen UI Test Suite', function () {
    let driver;

    before(async function () {
        this.timeout(30000);
        driver = await new Builder().forBrowser('firefox').build(); // Change to Firefox
        driver.manage().window().maximize();
    });

    after(async function () {
        this.timeout(10000);
        if (driver) {
            await driver.quit();
        }
    });

    it('should login with valid credentials', async function () {
        this.timeout(20000);
        await driver.get('http://localhost:80/login');
        const emailInput = await driver.findElement(By.name('email'));
        const passwordInput = await driver.findElement(By.name('password'));
        await emailInput.sendKeys('1@gmail.com');
        await passwordInput.sendKeys('password');
        const loginButton = await driver.findElement(By.id('login'));
        await driver.sleep(2000);
        await loginButton.click();
        await driver.wait(until.urlIs("http://localhost/"), 10000);
        await driver.get("http://localhost/");
        const dropdownToggle = await driver.wait(until.elementLocated(By.id('username')), 10000);
        await driver.wait(until.elementIsVisible(dropdownToggle), 10000);
        await dropdownToggle.click();
        const dropdownMenu = await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 10000);
        await driver.wait(until.elementIsVisible(dropdownMenu), 10000);
        const profileLink = await dropdownMenu.findElement(By.css('a[href="/profile"]'));
        await profileLink.click();
    });

    it('should login with valid credentials and add a card', async function () {
        this.timeout(20000);
        await driver.sleep(2000);
        await driver.get('http://localhost:80/profile');
        const authButton = await driver.wait(until.elementLocated(By.id('authButton')), 10000);
        await driver.wait(until.elementIsVisible(authButton), 10000);
        await authButton.click();
        const authCodeInput = await driver.wait(until.elementLocated(By.id('authCode')), 10000);
        const authCodeText = await authCodeInput.getAttribute('value');
        const dropdownToggle = await driver.wait(until.elementLocated(By.id('username')), 10000);
        await driver.wait(until.elementIsVisible(dropdownToggle), 10000);
        await dropdownToggle.click();
        const logoutLink = await dropdownToggle.findElement(By.css('a[data-rr-ui-dropdown-item][href="#"]'));
        await logoutLink.click();
        await driver.wait(until.urlIs("http://localhost/"), 10000);
        await driver.get("http://localhost/");
        await driver.get('http://localhost:80/login');
        const emailInput = await driver.findElement(By.name('email'));
        const passwordInput = await driver.findElement(By.name('password'));
        await emailInput.sendKeys('2@gmail.com');
        await passwordInput.sendKeys('password');
        const loginButton = await driver.findElement(By.id('login'));
        await driver.sleep(2000);
        await loginButton.click();
        await driver.wait(until.urlIs("http://localhost/"), 10000);
        await driver.get("http://localhost/");
        const dropToggle = await driver.wait(until.elementLocated(By.id('username')), 10000);
        await driver.wait(until.elementIsVisible(dropToggle), 10000);
        await dropToggle.click();
        const dropMenu = await driver.wait(until.elementLocated(By.css('.dropdown-menu')), 10000);
        await driver.wait(until.elementIsVisible(dropMenu), 10000);
        const profileLink = await dropMenu.findElement(By.css('a[href="/profile"]'));
        await profileLink.click();
        await driver.sleep(2000);
        await driver.get('http://localhost/profile');
        const addCardButton = await driver.wait(until.elementLocated(By.css('a[href="/cards/add/new"]')), 10000);
        await driver.wait(until.elementIsVisible(addCardButton), 10000);
        await addCardButton.click();
        await driver.sleep(2000);
        await driver.get('http://localhost/cards/add/new');
        const cardNumberInput = await driver.findElement(By.name('cardNumber'));
        await cardNumberInput.sendKeys('4701322211111234');
        const cardHolderInput = await driver.findElement(By.name('cardHolder'));
        await cardHolderInput.sendKeys('AAAA');
        const expirationMonthInput = await driver.findElement(By.name('cardMonth'));
        await expirationMonthInput.sendKeys('08');
        const expirationYearInput = await driver.findElement(By.name('cardYear'));
        await expirationYearInput.sendKeys('32');
        const yearOption = await driver.wait(until.elementLocated(By.xpath(`//select[@name='cardYear']//option[@value='2032']`)), 10000);
        await driver.wait(until.elementIsVisible(yearOption), 10000);
        await yearOption.click();
        const cvvInput = await driver.findElement(By.name('cardCvv'));
        await cvvInput.sendKeys('123');
        const authInput = await driver.findElement(By.name('authCode'));
        await authInput.sendKeys(authCodeText);
        await (await driver.findElement(By.css('button.btn.btn-primary[type="submit"]'))).click();
        await driver.sleep(2000);
        await driver.get('http://localhost/profile');
    });
});