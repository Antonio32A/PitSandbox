const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const url = "https://api.antonio32a.com/events";

class EventsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "events",
            memberName: "events",
			aliases: ["pitevents"],
			group: "default",
			description: "Tells you upcoming Hypixel Pit Events.",
            guildOnly: false
		});
	}

	async run(message) {
		fetch(url)
			.then(res => res.json())
			.then(json => {
				let text = "";
				json.slice(0, 20).forEach(event => text += `+${event.time}: ${event.name}\n`);

				message.reply(
					new MessageEmbed()
						.setTitle("Upcoming Hypixel Pit Events")
						.setColor("#8d6cef")
						.setDescription(text)
						.setFooter("Powered by " + url)
				).catch(console.error);
			}).catch(error => {
				console.error(error);
				return "An unknown error has occurred!";
		});
    }
}

module.exports = { EventsCommand };