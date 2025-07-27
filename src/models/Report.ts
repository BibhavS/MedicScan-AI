import mongoose, {Schema, Document, Types, Model} from "mongoose";

export interface IReport extends Document{
    userId: Types.ObjectId;
    fileUrl: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    content: {
        type: String
    }
}, {timestamps: true})

const Report : Model<IReport> =(mongoose.models.Report as Model<IReport>) || mongoose.model<IReport>("Report", ReportSchema);

export default Report;