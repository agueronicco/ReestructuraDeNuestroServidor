import { messageModel } from "../models/messages.js";

export default class Messages {
  constructor() {
    console.log("Working messages with DB in mongoDB");
  }

  getAll = async () => {
    try {
      const messages = await messageModel.find();
      return messages.map((message) => message.toObject());
    } catch (error) {
      console.log(error);
    }
  };

  addMessage = async (user, message) => {
    try {
      const result = await messageModel.create({ user, message });
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}
