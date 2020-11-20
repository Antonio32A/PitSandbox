const { Command } = require("discord.js-commando");
const { getPlayer } = require("./database");

class WhoIsCommand extends Command {
	constructor(client) {
		super(client, {
			name: "whois",
            memberName: "whois",
			aliases: ["who"],
			group: "default",
			description: "Checks who is somebody..",
            guildOnly: false,
            args: [{
                key: "member",
                prompt: "The Discord ID or username or mention of a member.",
                type: "member",
            }],
		});
	}

	async run(message, { member }) {
		const verified = await getPlayer( { id: member.id });
		if (!verified)
			return await message.reply("That person isn't verified!");

		await message.reply(`▲ ${member.user.tag} ➜ ${verified.ign}.`)
    }
}

module.exports = { WhoIsCommand };