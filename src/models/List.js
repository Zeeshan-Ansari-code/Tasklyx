import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a list title"],
      trim: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.List || mongoose.model("List", ListSchema);