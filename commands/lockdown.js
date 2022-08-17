module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You cannot run this command.");

    await message.channel.permissionOverwrites.set([

        {
            id: message.guild.roles.cache.find(r => r.name === "@everyone").id,
            deny: ["SEND_MESSAGES"]
        }

    ]);

    return message.channel.send("**__Channel in lockdown.__**")

}

module.exports.help = {
    name: "lockdown",
    category: "staff",
    description: "Lockdown the channel."
}