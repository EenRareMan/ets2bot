const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    const categoryID = "1009405729427427400";

    var userName = message.author.username;

    var userDiscriminator = message.author.discriminator

    var reason = args.join(" ");
    if (!reason) return message.channel.send("Provide a reason.");

    var ticketBestaat = false;

    message.guild.channels.cache.forEach((channel) => {

        if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {

            message.channel.send("You have a ticket.");

            ticketBestaat = true;

            return;

        }

    });

    if (ticketBestaat) return;

    message.guild.channels.create(userName.toLowerCase() + "-" + userDiscriminator, { type: "text" }).then((createdChan) => {

        createdChan.setParent(categoryID).then((settedParent) => {

            // Perms zodat iedereen niets kan lezen.
            settedParent.permissionOverwrites.edit(message.guild.roles.cache.find(x => x.name === "@everyone"), {

                SEND_MESSAGES: false,
                VIEW_CHANNEL: false

            });

            // READ_MESSAGE_HISTORY Was vroeger READ_MESSAGES
            // Perms zodat de gebruiker die het command heeft getypt alles kan zien van zijn ticket.
            settedParent.permissionOverwrites.edit(message.author.id, {
                CREATE_INSTANT_INVITE: false,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                CONNECT: true,
                ADD_REACTIONS: true
            });

            // Perms zodat de gebruikers die admin zijn alles kunnen zien van zijn ticket.
            settedParent.permissionOverwrites.edit(message.guild.roles.cache.find(x => x.name === '⚔️ Staff'), {
                CREATE_INSTANT_INVITE: false,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                CONNECT: true,
                ADD_REACTIONS: true,
                VIEW_CHANNEL: true
            });

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0'); // Nul toevoegen als het bv. 1 is -> 01
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = `${dd}/${mm}/${yyyy}`;

            let embedParent = new discord.MessageEmbed()
                .setColor("AQUA")
                .setThumbnail("https://outdooroutfitter.nl/wp-content/uploads/2018/02/ticket-clipart-purge-clipart-ticket-85041.jpg")
                .setTitle(message.author.username, message.author.displayAvatarURL({ size: 4096 }))
                .setTitle('New Ticket')
                .addFields(
                    { name: "Reason", value: reason, inline: false },
                    { name: "Created on", value: today, inline: false }
                );

            message.channel.send('The ticket is created.');

            settedParent.send({ embeds: [embedParent] });


        });


    });

}

module.exports.help = {
    name: "ticket",
    category: "general",
    description: "Make a ticket"
}