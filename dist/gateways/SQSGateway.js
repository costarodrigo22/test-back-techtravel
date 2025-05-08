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
exports.SQSGateway = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
class SQSGateway {
    constructor() {
        this.client = new client_sqs_1.SQSClient();
    }
    publishMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_sqs_1.SendMessageCommand({
                QueueUrl: 'https://sqs.us-east-1.amazonaws.com/901381315351/orderQueueProject',
                MessageBody: JSON.stringify(message),
            });
            yield this.client.send(command);
        });
    }
}
exports.SQSGateway = SQSGateway;
