"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../enums");
class MessagesExpire {
    constructor({ realm, config, messageHandler }) {
        this.timeoutId = null;
        this.realm = realm;
        this.config = config;
        this.messageHandler = messageHandler;
    }
    startMessagesExpiration() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        // Clean up outstanding messages
        this.timeoutId = setTimeout(() => {
            this.pruneOutstanding();
            this.timeoutId = null;
            this.startMessagesExpiration();
        }, this.config.cleanup_out_msgs);
    }
    stopMessagesExpiration() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
    pruneOutstanding() {
        const destinationClientsIds = this.realm.getClientsIdsWithQueue();
        const now = new Date().getTime();
        const maxDiff = this.config.expire_timeout;
        const seen = {};
        for (const destinationClientId of destinationClientsIds) {
            const messageQueue = this.realm.getMessageQueueById(destinationClientId);
            const lastReadDiff = now - messageQueue.getLastReadAt();
            if (lastReadDiff < maxDiff)
                continue;
            const messages = messageQueue.getMessages();
            for (const message of messages) {
                if (!seen[message.src]) {
                    this.messageHandler.handle(undefined, {
                        type: enums_1.MessageType.EXPIRE,
                        src: message.dst,
                        dst: message.src
                    });
                    seen[message.src] = true;
                }
            }
            this.realm.clearMessageQueue(destinationClientId);
        }
    }
}
exports.MessagesExpire = MessagesExpire;
