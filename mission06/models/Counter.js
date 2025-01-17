import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
    {
        countName: {
            type: String,
            require: true,
        },
        count: {
            type: Number,
            default: 1,
        },

    },
);

const Counter = mongoose.model("Counter", CounterSchema);

export default Counter;