import mongoose from "mongoose";

const idValidator = (...ids) => {
  ids.forEach((id) => {
    if (!mongoose.isValidObjectId(id)) throw new Error("Invalid id!");
  });
  return true;
};

export default idValidator;
