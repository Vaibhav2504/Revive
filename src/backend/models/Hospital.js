import { Schema, model } from "mongoose";

const hospitalSchema = new Schema({
    hospitalId: String,
    hospitalName: String,
    hospitalCode: String,
    hospitalEmail: String,
    hospitalPhone: String,
    address: String,

    adminName: String,
    adminEmail: String,
    adminPhone: String,

    password: String,

    subscriptionPlan: String,
    licenseExpiryDate: Date,
    status: String
});

export default model("Hospital", hospitalSchema);