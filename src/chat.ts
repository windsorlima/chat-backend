export interface User {
  username: string;
  room: string
  socket_id: string;
}

export interface Message {
  room: string;
  text: string;
  username: string;
  createdAt: Date;
}

export const messages: Message[] = []
export const users: User[] = [];
export const rooms: string[] = ["Java", "C#", "Python", "React", "Ruby", "Node", "JS", "C++"]

export const getMessagesRoom = (room: string) => {
  const messagesRoom = messages.filter((message) => message.room === room);

  return messagesRoom;
};