import mongoose, {Schema, Document, Types, Model} from "mongoose";

export interface IReport extends Document{
    user: Types.ObjectId;
    fileUrl: string;
    content: string;
    createdAt: Date;
}

const ReportSchema = new Schema<IReport>({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        requred: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const Report : Model<IReport> =(mongoose.models.Repor as Model<IReport>) || mongoose.model<IReport>("Report", ReportSchema);

export default Report;