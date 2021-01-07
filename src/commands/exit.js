exports.run = async (message) => {
    if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`)
    process.exit()
}