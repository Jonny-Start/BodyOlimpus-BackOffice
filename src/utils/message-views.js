class Message {
    static successMessage = [];
    static errorMessage = [];

    static crearMessage() {
        Message.successMessage = [];
        Message.errorMessage = [];
    }
}

module.exports = Message;
