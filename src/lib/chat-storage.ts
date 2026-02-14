const CHAT_PREFIX = "tagalong_chat_";

export interface ChatMessage {
  from: string; // username of sender
  text: string;
  time: number;
}

const CONV_SEP = "::";

function conversationId(user1: string, user2: string): string {
  return [user1, user2].sort().join(CONV_SEP);
}

export function getChatKey(otherUsername: string, currentUsername: string): string {
  return CHAT_PREFIX + conversationId(currentUsername, otherUsername);
}

export function getMessages(otherUsername: string, currentUsername: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(getChatKey(otherUsername, currentUsername));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addMessage(
  otherUsername: string,
  currentUsername: string,
  from: string,
  text: string,
): ChatMessage[] {
  const key = getChatKey(otherUsername, currentUsername);
  const messages = getMessages(otherUsername, currentUsername);
  const newMsg: ChatMessage = { from, text, time: Date.now() };
  const next = [...messages, newMsg];
  localStorage.setItem(key, JSON.stringify(next));
  return next;
}

export function getConversationList(currentUsername: string): { username: string; lastMessage: string; lastTime: number }[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(CHAT_PREFIX)) keys.push(k);
  }
  const list: { username: string; lastMessage: string; lastTime: number }[] = [];
  for (const k of keys) {
    const id = k.slice(CHAT_PREFIX.length);
    const [a, b] = id.split(CONV_SEP);
    if (!a || !b) continue;
    const other = a === currentUsername ? b : a;
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const messages = JSON.parse(raw) as ChatMessage[];
      if (messages.length === 0) continue;
      const last = messages[messages.length - 1];
      list.push({
        username: other,
        lastMessage: last.text,
        lastTime: last.time,
      });
    } catch {
      // skip
    }
  }
  list.sort((x, y) => y.lastTime - x.lastTime);
  return list;
}
