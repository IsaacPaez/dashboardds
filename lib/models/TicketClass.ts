import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudentRequest {
  _id?: Schema.Types.ObjectId;
  studentId: Schema.Types.ObjectId;
  requestDate: Date;
  status: 'pending' | 'accepted' | 'rejected';
  paymentMethod?: 'online' | 'local';
}

export interface IStudentEnrollment {
  studentId: Schema.Types.ObjectId;
  reason?: string;
  citation_number?: string;
  citation_ticket?: string;
  course_country?: string;
}

export interface ITicketClass extends Document {
  locationId: Schema.Types.ObjectId;
  date: Date;
  hour: string;
  endHour?: string;
  classId: Schema.Types.ObjectId;
  type: string;
  duration: string;
  students: IStudentEnrollment[];
  spots?: number;
  status?: "available" | "cancel" | "full" | "expired";
  studentRequests: IStudentRequest[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TicketClassSchema: Schema = new Schema({
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  endHour: {
    type: String,
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: "DrivingClass",
    required: true,
  },
  type: {
    type: String,
    default: "date",
    required: true,
    lowercase: true
  },
  duration: {
    type: String,
    required: true,
  },
  students: [{
    studentId: { type: Schema.Types.ObjectId, ref: "User" },
    reason: { type: String },
    citation_number: { type: String },
    citation_ticket: { type: String },
    course_country: { type: String },
  }],
  spots: {
    type: Number,
    default: 30,
    min: 1,
  },
  status: {
    type: String,
    enum: ["available", "cancel", "full", "expired"],
    default: "available",
    required: true,
  },
  studentRequests: [{
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    paymentMethod: { type: String, enum: ['online', 'local'] },
  }],
}, { timestamps: true });

// Index for better query performance
TicketClassSchema.index({ date: 1, status: 1 });
TicketClassSchema.index({ locationId: 1, date: 1 });

const TicketClass: Model<ITicketClass> = mongoose.models.TicketClass || mongoose.model<ITicketClass>("TicketClass", TicketClassSchema);

export default TicketClass;
