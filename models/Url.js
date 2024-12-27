import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: { type: String },
    clicks: [
      {
        timestamp: Date,
        userAgent: String,
        ipAddress: String,
        geolocation: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
