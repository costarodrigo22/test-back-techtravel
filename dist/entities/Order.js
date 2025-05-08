"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const node_crypto_1 = require("node:crypto");
class Order {
    constructor(email, amount) {
        this.email = email;
        this.amount = amount;
        this.id = (0, node_crypto_1.randomUUID)();
    }
}
exports.Order = Order;
