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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = __importDefault(require("../../utils/structures/BaseEvent"));
class ReadyEvent extends BaseEvent_1.default {
    constructor() {
        super('ready');
    }
    run(client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Simple ModMail => Logged on as ${client.user.username}#${client.user.discriminator} at ${new Date()}`);
            var statuses = [
                `people needing help!`,
                `people screaming in DMs`,
                `people messaging me!`,
                `Qumu music... so good!`,
                `SweetieRick`
            ];
            console.log(`Simple ModMail => The client has ${statuses.length} presences stored`);
            // Setting a pointer
            let point_presences = 0;
            setInterval(() => {
                let currentStatus = statuses[point_presences];
                // This prevents undefined from showing up
                if (!currentStatus) {
                    currentStatus = statuses[0];
                    point_presences = 0;
                }
                client.user.setPresence({ status: "online", activity: { name: `${currentStatus}`, type: "LISTENING" } });
                point_presences++;
            }, 30000);
        });
    }
}
exports.default = ReadyEvent;
