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
exports.SESGateway = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
class SESGateway {
    constructor() {
        this.client = new client_ses_1.SESClient();
    }
    sendEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, to, subject, html, }) {
            const command = new client_ses_1.SendEmailCommand({
                Source: from,
                Destination: {
                    ToAddresses: to,
                },
                Message: {
                    Subject: {
                        Charset: 'utf-8',
                        Data: subject,
                    },
                    Body: {
                        Html: {
                            Charset: 'utf-8',
                            Data: html,
                        },
                    },
                },
            });
            yield this.client.send(command);
        });
    }
}
exports.SESGateway = SESGateway;
