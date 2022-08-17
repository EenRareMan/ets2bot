const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    var botEmbed = new discord.MessageEmbed()
        .setTitle("**Info about the bot.**")
        .setDescription("This shows all the info about the custom bot.")
        .setColor("BLUE")
        .addFields(
            { name: "Bot name", value: client.user.username }
        )
        .setThumbnail("https://trucksbook.eu/data/system/fb_logo.png")
        .setImage("https://static-cdn.jtvnw.net/jtv_user_pictures/9ab68576-3a4f-44a2-a4dd-c20f58d21691-profile_image-300x300.png")
        .setTimestamp();

    return message.channel.send({ embeds: [botEmbed] });

}

module.exports.help = {
    name: "botinfo",
    category: "info",
    description: "Sends a embed with all the info about the bot."
}