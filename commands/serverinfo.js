const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    var serverEmbed = new discord.MessageEmbed()
        .setTitle("**Info about the qerver.**")
        .setDescription("This shows all the info about the server.")
        .setColor("GREEN")
        .addFields(
            { name: "Bot name", value: client.user.username },
            { name: "You have joined the server on", value: message.member.joinedAt.toString() },
            { name: "Total server members", value: message.guild.memberCount.toString() }
        )
        .setTimestamp();

    return message.channel.send({ embeds: [serverEmbed] });

}

module.exports.help = {
    name: "serverinfo",
    category: "info",
    description: "Sends you a embed with info about the server."
}