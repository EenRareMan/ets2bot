const fs = require("fs");
const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You cannot run this command.");

    if (!args[0]) return message.reply("You must provide a user.");

    if (!args[1]) return message.reply("You must provide a reason.");

    var warnUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);

    var reason = args.slice(1).join(" ");

    if (!warnUser) return message.reply("Can't find the user.");

    if (warnUser.permissions.has("KICK_MEMBERS")) return message.reply("You can't warn this person.");

    const warns = JSON.parse(fs.readFileSync("./warnings.json", "UTF8"));

    if (!warns[warnUser.id]) warns[warnUser.id] = {
        warns: 0
    }

    warns[warnUser.id].warns++;

    var embed = new discord.MessageEmbed()
        .setColor("ORANGE")
        .setTimestamp()
        .setDescription(`**The user that got warned:** ${warnUser.user.username} (${warnUser.id})
        **Warn given by:** ${message.author}
        **Reason: ** ${reason}`)
        .addFields(
            { name: "Total warns", value: warns[warnUser.id].warns.toString() }
        );

    const channel = message.member.guild.channels.cache.get("1009075609818890294");

    if (!channel) return;

    channel.send({ embeds: [embed] });

    if (warns[warnUser.id].warns == 4) {

        var mes = new discord.MessageEmbed()
            .setDescription("Be careful " + warnUser.user.username)
            .setColor("#ee0000")
            .addFields(
                { name: "Message", value: ("One more warn and you're banned!!") }
            );

        message.channel.send({ embeds: [mes] });

    } else if (warns[warnUser.id].warns == 5) {

        message.guild.members.ban(warnUser, { reason: reason });
        message.channel.send(`${warnUser} got banned by the bot for too many warns`);

        var banned = new discord.MessageEmbed()
            .setTitle("Member banned")
            .setDescription(`${warnUser.user.username} got banned for too many warns.`)
            .setColor("#ff0000")
            .setTimestamp();

        channel.send({ embeds: [banned] });


    }

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err);
    });

}

module.exports.help = {
    name: "warn",
    category: "staff",
    description: "Warn someone"
}