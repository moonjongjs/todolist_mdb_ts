import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    idx: { type: Number, unique: true },
    할일: { type: String, required: true },
    만료일: { type: Date, required: true },
    완료: { type: Boolean, default: false },
    삭제: { type: Boolean, default: false },
  },
  {
    collection: "todolist",
    timestamps: true,   // createdAt, updatedAt 자동 생성
    versionKey: false   // __v 제거
  }
);

// idx 자동 증가
TodoSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Counter = (await import("./Counter")).default;

    const counter = await Counter.findByIdAndUpdate(
      { _id: "todolist" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.idx = counter.seq;
  }
  next();
});

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
