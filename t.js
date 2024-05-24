const puppeteer = require('puppeteer');
let domain = "https://blackbox.ai",
    prompt = "Hey, who are you?",
    chatInputDiv = 'chat-input-box',
    chatOutputDiv = 'mb-2 last:mb-0'
    

async function chatWithWebsite() {
    console.log("Awaiting Puppeteer launch...")
    const browser = await puppeteer.launch();
    console.log("Puppeteer launched successfully!")
    console.log("Awaiting to open a blank page...")
    const page = await browser.newPage();
    console.log("Created a blank page!")
    console.log(`Awaiting to launch ${domain}...`)
    await page.goto(domain); 
    console.log(`${domain} launched successfully!`)

    console.log(`Waiting for ${chatInputDiv}...`)
    await page.waitForSelector(chatInputDiv);
    console.log(`${chatInputDiv} founded!`)
    console.log(`Waiting for input: prompt = *${prompt}*...`)
    await page.type(chatInputDiv, prompt); 
    console.log(`*${prompt}* has been entered successfully!`)

    console.log("Awaiting to send the message...")
    await page.keyboard.press('Enter');
    console.log("Message sent successfully!")

    console.log("Awaiting output...")
    await page.waitForSelector(chatOutputDiv);
    console.log(`Output found!`)
    console.log("Attempting to eval innerText...")
    const response = await page.$eval(chatOutputDiv, el => el.innerText);
    console.log("Eval successfull!")
    console.log("Logging your response...")
    console.log(response);

    console.log("Attempting to kill browser...")
    await browser.close();
    console.log("Browser killed!")
}

chatWithWebsite();
