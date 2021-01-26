import BaseEvent from '../../utils/structures/BaseEvent';
import { Message, MessageEmbed } from 'discord.js';
import DiscordClient from '../../client/client';
import { userInfo } from 'os';
const enmap = require('enmap')
const logchannel = process.env.LOGCHANNEL
const inboxGuild = process.env.INBOX_SERVER

const Threads = new enmap({
  name: "threads",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
})

export default class DirectMessageEvent extends BaseEvent {
  constructor() {
    super('directMessage');
  }

  // ! Note that in this case replying to the object 'message' will result replying to the user
  // ! To avoid conflict, determine a message object for the inbox guild
  async run(client: DiscordClient, message: Message) {
    const key = `${message.author.id}-${message.author.tag}`
    Threads.ensure(key, {
      name: "threads",
      fetchAll: false,
      autoFetch: true,
      cloneLevel: 'deep'
    })
    // Here goes the logic for Direct Messages incoming
    console.log(`Simple ModMail => New message incoming from ${message.author.username}#${message.author.discriminator}`)

    if (!Threads.has(`${message.author.id}-${message.author.tag}`)) {
      let open_emb = new MessageEmbed()
          .setTitle(`Hey ${message.author.username}, need help?`)
          .setDescription("Thanks for contacting support! Please wait patiently for our staff team to assist you. Meanwhile, can you please tell us more about your inquery?")
          .setFooter("Please wait until a staffer comes to you", `${message.author.displayAvatarURL({dynamic: true})}`)
          .setColor(0xFFFBF9)
          .setTimestamp(new Date())
      message.channel.send(open_emb)
      await Threads.set(`${key} • Opened Thread`, message.guild)

      // Then we proceed to make the actual ticket channel in the inbox server
      const inbox = client.guilds.cache.get(inboxGuild)
      const logging = client.channels.cache.get(logchannel)
      if (inbox) {
        if (!logging) {
          let nochannel_emb = new MessageEmbed()
              .setTitle("I'm sorry, the mailbox encountered an error")
              .setDescription("I could not deliver your message to the staff team as there is a technical problem right now. Please reach out our staffers by directly messaging them.")
              .setColor("RED")
          await message.channel.send(nochannel_emb)
        } else {
          let newthread_emb = new MessageEmbed()
              .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
              .setTitle(`New support thread!`)
              .setDescription(`${message.content}`)
              .addField(`${message.author.username} Info`, `Join Date: ${message.author.createdAt}, ID: ${message.author.id}`)
              .setFooter(`${inbox.name}`)
              .setTimestamp(new Date())
          // const logMsg = await logging.send(newthread_emb)
        }
      }
    } else {
      let welcomeback_emb = new MessageEmbed()
          .setTitle(`Welcome back ${message.author.username}! Need help?`)
          .setDescription("Thanks for contacting support! Please wait patiently for our staff team to assist you. Meanwhile, can you please tell us more about your inquery?")
          .setFooter("Please wait until a staffer comes to you", `${message.author.displayAvatarURL({dynamic: true})}`)
          .setColor(0xFFFBF9)
          .setTimestamp(new Date())
      message.channel.send(welcomeback_emb)
      await Threads.set(`${key} • Opened Thread (Member)`, message.guild)
    }
  }
}