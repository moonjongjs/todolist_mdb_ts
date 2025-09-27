import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // 어떤 컬렉션의 카운터인지 구분
  seq: { type: Number, default: 0 }
});

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
