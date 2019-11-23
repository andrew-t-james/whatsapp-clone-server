import { DateTimeResolver, URLResolver } from 'graphql-scalars'

import { chats, messages } from '../db'

interface Message {
  id: string
  content: string
  createdAt: Date
}

interface Chat {
  id: string
  name: string
  picture: string
  lastMessage: string
  messages: [string]
}

interface Chats {
  [id: number]: Chat
}

const resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,
  Chat: {
    lastMessage(chat: Chat): Message | undefined {
      const lastMessage = chat.messages[chat.messages.length - 1]
      return messages.find(m => m.id === lastMessage)
    },
    messages(chat: Chat): Message[] {
      return messages.filter(m => chat.messages.includes(m.id))
    }
  },
  Query: {
    chats(): Chats[] {
      return chats
    },
    chat(root: object, { chatId }: { chatId: string }): Chats | undefined {
      return chats.find(c => c.id === chatId)
    }
  }
}
export default resolvers
