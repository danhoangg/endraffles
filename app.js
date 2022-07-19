//libraries
const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

//urls needed
const Page = "https://launches.endclothing.com/product/travis-scott-x-air-jordan-1-low-dm7866-162";

//CHANGE THIS TO THE PATH OF THE CSV FILE
const CsvFilePath = 'active.csv';

//file path to list of proxies
const ProxiesFilePath = 'proxies.txt';

//Create values for time in milliseconds
const minute = 1000 * 60;
const hour = minute * 60;

//Define selectors needed
const accLogin = 'div[aria-label="Account"] > button.sc-vusgcu-1.gNOsfS';
const emailLogin = '#email';
const passwordLogin = '#password';
const continueBtn = 'button[value="Continue"]';
const sizeSelect = 'div[name="draw_form"] > div.sc-1bm65b4-3.eMsFtq > div.sc-1bm65b4-0.hAFLhY > button';
const size = 'li[data-testid="SizeDropdown__select_btn"]';

//create sleep fucntion
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Starting...');

var proxies;

proxies = fs.readFileSync(ProxiesFilePath, 'utf8').split("\n").map(r => r.split(":"));

var j = Math.floor(Math.random() * (proxies.length - 1))
var errCount = 0;

var results = []
fs.createReadStream(CsvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log('CSV file successfully read...');

        //loop through async functions one at a time
        (async () => {
            for (i = 0; i < results.length; i++) {

                //proxy info
                var proxyUrl = proxies[j][0] + ':' + proxies[j][1];
                var proxyUser = proxies[j][2];
                var proxyPass = proxies[j][3];
                j++;

                //inputs
                var emailCsv = results[i][Object.keys(results[i])[0]];
                var passCsv = results[i][Object.keys(results[i])[1]];

                var check = await EnterAccount(proxyUrl, proxyUser, proxyPass, emailCsv, passCsv);

                if (check == false) {
                    if (errCount == 2) {
                        console.log('\x1b[31m%s\x1b[0m', `Blocked too many times, waiting...`);
                        errCount = 0;
                        i--;
                        await sleep(30 * minute);
                    } else {
                        i--;
                        errCount++;
                    }
                    check = true;
                    await sleep(5000);
                } else {
                    errCount = 0;
                    console.log('\x1b[32m%s\x1b[0m', `${i + 1}. ${emailCsv} entered...`);
                }

                await sleep(Math.floor(Math.random() * 5000) + 10000);

                if (j == proxies.length) {
                    j = 0;
                }

            }

        })();
    });

async function EnterAccount(proxyUrl, proxyUser, proxyPass, emailInp, passInp) {
    try {
        //connect to localhost proxy
        browser = await puppeteer.launch({
            args: ['--proxy-server=' + proxyUrl],
            //args: ['--start-maximized'],
            headless: false,
            slowMo: 90,
        });
        page = await browser.newPage();
        //console.log(`Connected to proxy ${proxyUser}...`);
    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Proxy not running...Connecting without proxy...');
    }

    if (proxyUser !== '') {
        //console.log("Authenticating proxy user/pass...");
        await page.authenticate({
            username: proxyUser,
            password: proxyPass
        });
    }

    try {
        //Randomise page width
        pageWidth = Math.floor(Math.random() * (1920 - 1100)) + 1100;

        //Open window
        await page.setViewport({ width: pageWidth, height: 793 });
        await page.goto(Page);

        if (page.url() === "https://www.endclothing.com/distil_r_drop.html") {
            console.log('\x1b[33m%s\x1b[0m', `Error creating account for ${emailInp}...`);
            browser.close();
            return false;
        }

        await page.waitForSelector(accLogin);
        await page.click(accLogin);

        if (page.url() === "https://www.endclothing.com/distil_r_drop.html") {
            console.log('\x1b[33m%s\x1b[0m', `Error creating account for ${emailInp}...`);
            browser.close();
            return false;
        }

        await sleep(Math.floor(Math.random() * 2000) + 3000);
        await page.type(emailLogin, emailInp);

        await page.click(continueBtn);

        await sleep(Math.floor(Math.random() * 2000) + 3000);
        await page.type(passwordLogin, passInp);

        await page.click(continueBtn);
        await sleep(1000);

        if (page.url() === "https://www.endclothing.com/distil_r_drop.html") {
            console.log('\x1b[33m%s\x1b[0m', `Error creating account for ${emailInp}...`);
            browser.close();
            return false;
        }

        await page.click(sizeSelect);

        await page.click(size);

    } catch (err) {
        console.log('\x1b[33m%s\x1b[0m', err);
        console.log('\x1b[33m%s\x1b[0m', `Error entering account for ${emailInp}...\n`);
        browser.close();
        return false;
    }
}