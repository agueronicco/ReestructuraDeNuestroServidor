import userModel from "../models/users.js";

export default class Users {
  constructor() {
    console.log("Working users with DB in mongoDB");
  }

  add = async (user) => await userModel.create(user);

  findById = async (uid) => await userModel.findOne({ _id: uid });

  findByEmail = async (email) => await userModel.findOne({ email });

  update = async (email, user) => await userModel.updateOne({ email }, user);
}
