const { Command } = require("discord.js-commando");
const { generateId, waitForMessage, fetchMinecraftUUID, authorReply } = require("./utils");
const { updatePlayer } = require("./database");
const fs = require("fs").promises;

class VerifyCommand extends Command {
	constructor(client) {
		super(client, {
			name: "verify",
            memberName: "verify",
			aliases: ["v"],
			group: "default",
			description: "Verifies your account.",
            guildOnly: false
		});
	}

	async run(message) {
	    const id = generateId();

		try {
	    	await message.author.send(`Do \`/msg g1thub ${id}\` on the server to get verified!`);
		} catch (e) {
			if (message.guild) {
				try {
					return await message.reply(
						"I cannot message you, please unblock me or change your privacy settings!"
					);
				} catch (e) {} // no perms
			}
		}

		if (message.guild)
	    	try {
				await message.reply("Sent you the code!");
			} catch (e) {} // no perms

	    waitForMessage(new RegExp(`^\\[(?<author>\\w{3,16}) -> me] ${id}$`), 30000)
            .then(response => {
                const ign = response.groups.author;
				fetchMinecraftUUID(ign)
					.then(uuid => {
						const data = { uuid, id: message.author.id, ign };
						updatePlayer(data, data)
							.then(() => {
								message.author.send(`Successfully verified as ${ign}!`).catch();
								authorReply(ign, `Successfully verified as ${message.author.tag}!`);
							}).catch(console.error);
					})
					.catch(console.error);
            }).catch(() => message.author.send("You didn't type the correct code in time. Exiting."));
    }
}

const getData = () => new Promise(((resolve, reject) => {
    fs.readFile("./data/verified.json")
        .then(body => JSON.parse(body))
        .then(resolve)
        .catch(reject);
}));

module.exports = { VerifyCommand, getData };