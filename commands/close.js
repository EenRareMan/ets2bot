const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    const categoryID = "1009405729427427400";

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You cannot run this command.");

    if (message.channel.parentId == categoryID) {

        message.channel.delete();

        var embedTicket = new discord.MessageEmbed()
            .setTitle("Ticket, " + message.channel.name)
            .setDescription("The ticket is **done**.")
            .setColor("BLURPLE")
            .setTimestamp()
            .setFooter("Ticket closed")

        var ticketLogging = message.member.guild.channels.cache.find(channel => channel.name === "ticket-logs");
        if (!ticketLogging) return message.reply("Logging channel is not found.");

        return ticketLogging.send({ embeds: [embedTicket] });

    } else {
        return message.channel.send("Please do this in a ticket.")
    }

}

module.exports.help = {
    name: "close",
    category: "staff",
    description: "Close a ticket."
}