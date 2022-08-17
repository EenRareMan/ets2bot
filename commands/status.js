module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("You cannot run this command.");

    var statusTxt = args.join(" ");

    client.user.setPresence({

        status: "online",
        activities: [

            {
                name: statusTxt
            }

        ]

    });

    return;

}

module.exports.help = {
    name: "status",
    category: "staff",
    description: "Change the status."
}