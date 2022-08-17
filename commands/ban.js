const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("You cannot run this command.");

    if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.reply("The bot has no permissions, please contact the bot developer.");

    if (!args[0]) return message.reply("You must provide a user.");

    if (!args[1]) return message.reply("You must provide a reason.");

    var banUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);

    if (!banUser) return message.reply("Can't find the user.");

    if (banUser.permissions.has("KICK_MEMBERS")) return message.reply("You can't ban this person.");

    const channel = message.member.guild.channels.cache.get("1009075609818890294");

    var reason = args.slice(1).join(" ");

    var embedPrompt = new discord.MessageEmbed()
        .setColor("#0800ff")
        .setTitle("Please respond within 30 seconds")
        .setDescription(`Do you want to ban ${banUser}?`);

    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setDescription(`**Banned:** ${banUser}
        **User got banned by:** ${message.author}
        **Reason:** ${reason}`)
        .setTimestamp();

    message.channel.send({ embeds: [embedPrompt] }).then(async msg => {

        let authorID = message.author.id;
        let time = 30;
        let reactions = ["✅", "❌"];

        // We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
        time *= 1000;

        // We gaan iedere reactie meegegeven onder de reactie en deze daar plaatsen.
        for (const reaction of reactions) {
            await msg.react(reaction);
        }

        // Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
        // dan kunnen we een bericht terug sturen.
        const filter = (reaction, user) => {
            return reactions.includes(reaction.emoji.name) && user.id === authorID;
        };

        // We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
        // Dan kunnen we bericht terug sturen met dat icoontje dat is aangeduid.
        msg.awaitReactions({ filter, max: 1, time: time }).then(collected => {
            var emojiDetails = collected.first();

            if (emojiDetails.emoji.name === "✅") {

                msg.delete();

                banUser.ban({reason: reason}).catch(err => {
                    console.log(err);
                });

                channel.send({embeds: [embed]});

            } else if (emojiDetails.emoji.name === "❌") {

                msg.delete();

                message.channel.send("Ban canceled").then(msg => {
                    message.delete()
                    setTimeout(() => message.delete(), 5000);
                });

            }


        });
    });

}

module.exports.help = {
    name: "ban",
    category: "staff",
    description: "Ban a member."
}