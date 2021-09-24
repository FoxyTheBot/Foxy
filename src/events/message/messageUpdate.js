module.exports = async (client, _, newMessage) => {
    client.emit('message', newMessage);
};