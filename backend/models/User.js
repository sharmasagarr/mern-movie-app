import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

// ✅ Async pre-save hook WITHOUT `next`
userSchema.pre("save", async function () {
  // `this` is the document
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
