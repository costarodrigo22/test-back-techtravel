"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceOrder = void 0;
const Order_1 = require("../entities/Order");
class PlaceOrder {
    execute(dynamoOrderRepository, sqsGateway, sesGateway) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerEmail = 'drigo_123_123@hotmail.com';
            const amount = Math.ceil(Math.random() * 1000);
            const order = new Order_1.Order(customerEmail, amount);
            dynamoOrderRepository.create(order);
            sqsGateway.publishMessage({ orderId: order.id });
            sesGateway.sendEmail({
                from: 'costarodrigosilva247@gmail.com',
                to: [customerEmail],
                subject: `O pedido #${order.id} foi confirmado`,
                html: `
        <h1>E ai meu cumpadi</h1>

        <p>Passado aqui pra avisar que o seu pedido foi confirmado</p>

        <small>{{ tabela com os itens do pedido }}</small>
      `,
            });
            return { orderId: order.id };
        });
    }
}
exports.PlaceOrder = PlaceOrder;
