module.exports.run = async (client, message, args) => {

    return message.channel.send("Hello!");

}

module.exports.help = {
    name: "hello",
    category: "general",
    description: "Says hello back."
}