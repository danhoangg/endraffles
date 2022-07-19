//libraries
const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');

//urls needed
const MainPage = "https://www.endclothing.com/gb";
const AddAddress = "https://www.endclothing.com/gb/account/addresses/shipping/new";
const AddPayment = "https://www.endclothing.com/gb/account/payment/new";

//CHANGE THIS TO THE PATH OF THE CSV FILE
const CsvFilePath = 'active.csv';

//file path to list of proxies
const ProxiesFilePath = 'proxies.txt';

//Create values for time in milliseconds
const minute = 1000 * 60;
const hour = minute * 60;

//create sleep fucntion
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
                var fnameCsv = results[i][Object.keys(results[i])[3]];
                var snameCsv = results[i][Object.keys(results[i])[4]];
                var emailCsv = results[i][Object.keys(results[i])[0]];
                var phoneCsv = createMobilePhoneNumber("UK");
                var passCsv = results[i][Object.keys(results[i])[1]];
                var postcodeCsv = results[i][Object.keys(results[i])[8]];
                var addressCsv = results[i][Object.keys(results[i])[5]];
                var address2Csv = results[i][Object.keys(results[i])[6]];
                var cityCsv = results[i][Object.keys(results[i])[7]];
                var countyCsv = results[i][Object.keys(results[i])[9]];

                var cardNumberCsv = results[i][Object.keys(results[i])[11]];
                var expirationMCsv = results[i][Object.keys(results[i])[12]];
                var expirationYCsv = results[i][Object.keys(results[i])[13]];
                var cvvCsv = results[i][Object.keys(results[i])[14]];

                //if (check == false) {
                //    if (errCount == 3) {
                //        //console.log(`Blocked too many times, ${i + 1}. ${emailCsv} skipped...`);
                //        console.log('\x1b[31m%s\x1b[0m', `Blocked too many times, waiting...`);
                //        //badAccounts.push(emailCsv);
                //        //badAccountPos.push(i);
                //        errCount = 0;
                //        i--;
                //        await sleep(30 * minute);
                //    } else {
                //        i--;
                //        errCount++;
                //    }
                //    check = true;
                //    await sleep(5000);
                //} else {
                //    errCount = 0;
                //    console.log('\x1b[32m%s\x1b[0m', `${i + 1}. ${emailCsv} created...`);
                //}

                await sleep(Math.floor(Math.random() * 5000) + 10000);

                if (j == proxies.length) {
                    j = 0;
                }

            }



        })();
    });