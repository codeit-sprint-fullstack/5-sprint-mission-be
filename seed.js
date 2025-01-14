import mongoose from "mongoose";
// import missionData from "./seedData/missionData.js";
// import Mission from "./models/Mssion.js";
import * as dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

// await Mission.deleteMany({});
// await Mission.insertMany(missionData);

mongoose.connection.close();
