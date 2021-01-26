import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run (client: DiscordClient) {
    console.log(`Simple ModMail => Logged on as ${client.user.username}#${client.user.discriminator} at ${new Date()}`);
    var statuses = [
      `people needing help!`,
      `people screaming in DMs`,
      `people messaging me!`,
      `Qumu music... so good!`,
      `SweetieRick`
    ]

    console.log(`Simple ModMail => The client has ${statuses.length} presences stored`)
    // Setting a pointer
    let point_presences = 0
    setInterval(() => {
      let currentStatus = statuses[point_presences]
      // This prevents undefined from showing up
      if (!currentStatus) {
        currentStatus = statuses[0]
        point_presences = 0
      }
      client.user.setPresence({status: "online", activity: {name: `${currentStatus}`, type: "LISTENING"}})
      point_presences++
    }, 30000)
  }
}