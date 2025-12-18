import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a board title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    background: {
      type: String,
      default: "bg-blue-500",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "member", "viewer"],
          default: "member",
        },
      },
    ],
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["private", "team", "public"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Board || mongoose.model("Board", BoardSchema);