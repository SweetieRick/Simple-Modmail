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
const dotenv_1 = require("dotenv");
dotenv_1.config();
const registry_1 = require("./utils/registry");
const client_1 = __importDefault(require("./client/client"));
const client = new client_1.default({});
(() => __awaiter(void 0, void 0, void 0, function* () {
    client.prefix = process.env.DISCORD_BOT_PREFIX || client.prefix;
    yield registry_1.registerCommands(client, '../commands');
    yield registry_1.registerEvents(client, '../events');
    yield client.login(process.env.DISCORD_BOT_TOKEN);
}))();
