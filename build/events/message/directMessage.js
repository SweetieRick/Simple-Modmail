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
const discord_js_1 = require("discord.js");
const enmap = require('enmap');
const logchannel = process.env.LOGCHANNEL;
const inboxGuild = process.env.INBOX_SERVER;
const Threads = new enmap({
    name: "threads",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
});
class DirectMessageEvent extends BaseEvent_1.default {
    constructor() {
        super('directMessage');
    }
    // ! Note that in this case replying to the object 'message' will result replying to the user
    // ! To avoid conflict, determine a message object for the inbox guild
    run(client, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${message.author.id}-${message.author.tag}`;
            Threads.ensure(key, {
                name: "threads",
                fetchAll: false,
                autoFetch: true,
                cloneLevel: 'deep'
            });
            // Here goes the logic for Direct Messages incoming
            console.log(`Simple ModMail => New message incoming from ${message.author.username}#${message.author.discriminator}`);
            if (!Threads.has(`${message.author.id}-${message.author.tag}`)) {
                let open_emb = new discord_js_1.MessageEmbed()
                    .setTitle(`Hey ${message.author.username}, need help?`)
                    .setDescription("Thanks for contacting support! Please wait patiently for our staff team to assist you. Meanwhile, can you please tell us more about your inquery?")
                    .setFooter("Please wait until a staffer comes to you", `${message.author.displayAvatarURL({ dynamic: true })}`)
                    .setColor(0xFFFBF9)
                    .setTimestamp(new Date());
                message.channel.send(open_emb);
                yield Threads.set(`${key} • Opened Thread`, message.guild);
                // Then we proceed to make the actual ticket channel in the inbox server
                const inbox = client.guilds.cache.get(inboxGuild);
                const logging = client.channels.cache.get(logchannel);
                if (inbox) {
                    if (!logging) {
                        let nochannel_emb = new discord_js_1.MessageEmbed()
                            .setTitle("I'm sorry, the mailbox encountered an error")
                            .setDescription("I could not deliver your message to the staff team as there is a technical problem right now. Please reach out our staffers by directly messaging them.")
                            .setColor("RED");
                        yield message.channel.send(nochannel_emb);
                    }
                    else {
                        let newthread_emb = new discord_js_1.MessageEmbed()
                            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                            .setTitle(`New support thread!`)
                            .setDescription(`${message.content}`)
                            .addField(`${message.author.username} Info`, `Join Date: ${message.author.createdAt}, ID: ${message.author.id}`)
                            .setFooter(`${inbox.name}`)
                            .setTimestamp(new Date());
                        yield message.channel.send(newthread_emb);
                    }
                }
            }
            else {
                let welcomeback_emb = new discord_js_1.MessageEmbed()
                    .setTitle(`Welcome back ${message.author.username}! Need help?`)
                    .setDescription("Thanks for contacting support! Please wait patiently for our staff team to assist you. Meanwhile, can you please tell us more about your inquery?")
                    .setFooter("Please wait until a staffer comes to you", `${message.author.displayAvatarURL({ dynamic: true })}`)
                    .setColor(0xFFFBF9)
                    .setTimestamp(new Date());
                message.channel.send(welcomeback_emb);
                yield Threads.set(`${key} • Opened Thread (Member)`, message.guild);
            }
        });
    }
}
exports.default = DirectMessageEvent;
