/** Takes a single NetworkMessage or a NetworkMessage array and returns a new
 * array of Message objects with all the stringified properties converted into
 * native JS objects.
 *
 * @param messages Message or array of Messages
 */
function parseNetworkMessages(
  messages: NetworkMessage | NetworkMessage[],
): Message[] {
  let nextMessages: NetworkMessage[] = [];
  if (Array.isArray(messages)) {
    nextMessages = messages;
  } else {
    nextMessages = [messages];
  }
  const processedMessages = nextMessages.map((message) => ({
    ...message,
    postedAt: new Date(message.postedAt),
  }));
  return processedMessages;
}

export { parseNetworkMessages };
