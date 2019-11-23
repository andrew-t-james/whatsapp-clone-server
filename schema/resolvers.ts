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
}

const resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,
  Chat: {
    lastMessage(chat: Chat): Message | undefined {
      return messages.find(m => m.id === chat.lastMessage)
    }
  },
  Query: {
    chats(): Chat[] {
      return chats
    }
  }
}
export default resolvers
