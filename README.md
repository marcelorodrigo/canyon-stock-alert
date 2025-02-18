# Canyon Stock Alert

Canyon Stock Alert is a simple web scraper that monitors the availability of desired bikes on the Canyon website. It notifies you when a bike you're interested in becomes available in your preferred size.

## Configuration

Before using the script, there are a few parameters you must adjust in the `.ENV` file:

* `BIKE_URLS` - An array of URLs representing the variations of bikes you want to monitor. It doesn't matter which country are you looking forward to buy.
* `BIKE_SIZE` - The frame size you want to monitor for availability. It only supports one size.
* `TELEGRAM_TOKEN` - You'll need to create a [Telegram bot](https://core.telegram.org/bots#6-botfather) and use the provided token to send you notifications.
* `TELEGRAM_CHAT_ID` - To receive notifications, you must create a Telegram group and add your bot. Here you configure the chat ID where you want the bot to send notifications. To find out this ID, add `@raw_data_bot` to the group and you will easily find it.
* `INTERVAL` - By default, it checks every 6 minutes. You can adjust the monitoring interval as desired, in minutes.

## Usage

To run the script, ensure you have **Node.js v18** or above installed on your system. Then follow these steps:

1. Run `pnpm install` to install the required dependencies.
2. Execute `pnpm run env` to create a default `.ENV` file. (or manually copy it from `.env_sample`)
3. Execute `pnpm start` to start the monitoring.
4. If you plan to run as a console application on your *nix system, please use `((pnpm start > output.log &)&)`

The script will periodically check for the availability of the specified bike size. If the desired size becomes available, you will receive a notification on Telegram. Additionally, the script will send a status message every 12 hours to confirm that it's running as expected.

Please note that this script is designed to be straightforward and efficient, focusing on checking for the presence of the "Notify me" button for the desired size. If the button is absent, a notification will be sent to you.

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to create a pull request.

## License

This project is licensed under the [Apache 2.0 License](LICENSE).
