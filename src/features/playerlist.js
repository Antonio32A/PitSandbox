const { playerlistChannel, playerlistMessage, footer } = require("../../config.json");
const { MessageEmbed } = require("discord.js");

setInterval(async () => {
    const players = Object.values(bot.players).map(p => p.username);
    const half = Math.ceil(players.length / 2);
    const firstHalf = players.splice(0, half);
    const secondHalf = players.splice(-half);

    const embed = new MessageEmbed()
        .addField("Players Online", firstHalf.join("\n"), true)
        .addField("\u200B", secondHalf.join("\n"), true)
        .setColor("#c5a0f5")
        .setFooter(footer);

    const channel = client.channels.cache.get(playerlistChannel);
    const message = await channel.messages.fetch(playerlistMessage);

    await message.edit(embed);
}, 30000);
