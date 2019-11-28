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

  Mutation: {
    addMessage(root: object, { id, content }: Message): Message | null {
      const chatIndex = chats.findIndex(c => c.id === id)
      if (chatIndex === -1) return null
      const chat = chats[chatIndex]
      const messagesIds = messages.map(currentMessage =>
        Number(currentMessage.id)
      )
      const messageId = String(Math.max(...messagesIds) + 1)
      const message = {
        id: messageId,
        createdAt: new Date(),
        content
      }
      messages.push(message)
      chat.messages.push(messageId)
      // The chat will appear at the top of the ChatsList component
      chats.splice(chatIndex, 1)
      chats.unshift(chat)
      return message
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
