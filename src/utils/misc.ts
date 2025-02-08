export function sendChatMessage(source: number, message: string) {
  return exports.chat.addMessage(source, message);
}