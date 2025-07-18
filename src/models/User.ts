import mongoose, {Schema, Document, Model} from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    forgotPasswordToken: string,
    forgotPasswordTokenExpiry: Date,
    verifyCode: string,
    verifyCodeExpiry: Date,
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "UserName is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: {
        type: String,
        required: false
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        required: false
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: true
    }
})

const User : Model<IUser> = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;