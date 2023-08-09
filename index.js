const express = require('express');
const jsdom = require('jsdom');
const dotenv = require('dotenv').config();
const { JSDOM } = jsdom;

const app = express()
const validations = require('./validations');
validations.validateEnv();

const interval = parseInt(process.env.INTERVAL) || 6;
const bikeUrls = JSON.parse(process.env.BIKE_URLS.replace(/'/g, '"'))
const port = parseInt(process.env.PORT) || 3000;


let lastUptimeCheckDate = Date.now()

const log = (message) => {
    console.log(`[${new Date().toString()}] ${message}`);
}

const fetchWithTimeout = async (resource, options = {}) => {
    const { timeout: fetchTimeOut = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), fetchTimeOut);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

const sendMessage = async (message) => {
    log(`Sending message: ${message}`)
    try {
        await fetchWithTimeout(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
            }),
        })
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const checkBikeAvailability = async () => {
    let isBikeAvailableToBuy = false;

    if (Date.now() - lastUptimeCheckDate > 12 * 60 * 60 * 1000) {
        lastUptimeCheckDate = Date.now()
        await sendMessage('Monitor is still working')
    }

    for (const url of bikeUrls) {
        try {
            log('Fetching ' + url);
            const response = await fetchWithTimeout(url)
            const html = await response.text()
            const { document } = new JSDOM(html).window
            const desiredSize = document.querySelector(`.productConfiguration__optionListItem .productConfiguration__selectVariant[data-product-size="${process.env.BIKE_SIZE}"]`).innerHTML

            isBikeAvailableToBuy = !desiredSize.includes('Notify')

            if (isBikeAvailableToBuy) {
                await sendMessage('The wait is over, your bike is in stock! Go to ' + url)
            }
        } catch (error) {
            console.error('There seems to be an error:', error)
        }
    }
    log('End monitoring');
};

app.listen(port, () => {
    sendMessage(`Starting monitoring for ${bikeUrls.length} bike(s) every ${interval} minute(s).`);
    setInterval(checkBikeAvailability, interval * 60 * 1000);
});
