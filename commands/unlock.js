module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You cannot run this command.");

    await message.channel.permissionOverwrites.set([

        {
            id: message.guild.roles.cache.find(r => r.name === "@everyone").id,
            allow: ["SEND_MESSAGES"]
        }

    ]);

    return message.channel.send("**__Channel out of lockdown.__**")

}

module.exports.help = {
    name: "unlock",
    category: "staff",
    description: "Unlockdown the channel."
}