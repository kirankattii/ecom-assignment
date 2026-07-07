import bcrypt from "bcrypt";
import { Document, Schema, model } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default model<IAdmin>("Admin", adminSchema);
