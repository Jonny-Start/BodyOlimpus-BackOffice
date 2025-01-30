class Message {
    static success = [];
    static error = [];

    static clearMessages() {
        Message.success = [];
        Message.error = [];
    }
}

module.exports = Message;
