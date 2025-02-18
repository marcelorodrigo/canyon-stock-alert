import fs from 'fs'
import express, {Express} from 'express'
import { JSDOM } from 'jsdom'
import dotenv from 'dotenv'
dotenv.config()

if(!fs.existsSync('.env')) {
    console.error('It looks like the .env file does not exist. Please run `pnpm run env` to create it.')
    process.exit(1)
}


const app: Express = express()
import * as validations from './validations'
validations.validateEnv()

const interval: number = process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 6
const bikeUrls = process.env.BIKE_URLS ? JSON.parse(process.env.BIKE_URLS.replace(/'/g, '"')) : []
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000
const timeout: number = 8_000


let lastUptimeCheckDate = Date.now()

const log = (message: string) => {
    console.log(`[${new Date().toString()}] ${message}`)
}

const fetchWithTimeout = async (resource: string, options: {} = {}): Promise<Response> => {
    const controller: AbortController = new AbortController()
    const id: NodeJS.Timeout = setTimeout(() => controller.abort(), timeout)

    const response: Response = await fetch(resource, {
        ...options,
        signal: controller.signal
    })
    clearTimeout(id)
    return response
}

const sendMessage = async (message: string): Promise<void> => {
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
        console.error('Error sending message:', error)
    }
};

const checkBikeAvailability = async (): Promise<void> => {
    let isBikeAvailableToBuy: boolean = false;

    if (Date.now() - lastUptimeCheckDate > 12 * 60 * 60 * 1000) {
        lastUptimeCheckDate = Date.now()
        await sendMessage('Monitor is still working')
    }

    for (const url of bikeUrls) {
        try {
            log('Fetching ' + url);
            const response: Response = await fetchWithTimeout(url)
            const html: string = await response.text()
            const {document} = new JSDOM(html).window
            const element = document.querySelector(`.productConfiguration__optionListItem .productConfiguration__selectVariant[data-product-size="${process.env.BIKE_SIZE}"]`)

            let desiredSize: string | null = null
            if (element) {
                desiredSize = element.innerHTML
                isBikeAvailableToBuy = !desiredSize.includes('Notify')
            }

            if (isBikeAvailableToBuy) {
                await sendMessage('The wait is over, your bike is in stock! Go to ' + url)
            }
        } catch (error) {
            console.error('There seems to be an error:', error)
        }
    }
    log('End monitoring')
};

app.listen(port, (): void => {
    sendMessage(`Starting monitoring for ${bikeUrls.length} bike(s) every ${interval} minute(s).`)
    setInterval(checkBikeAvailability, interval * 60 * 1_000)
});
