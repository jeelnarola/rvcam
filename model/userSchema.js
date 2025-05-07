import mongoose, { model, Types } from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    mobileNumber: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v); // Ensures exactly 10 digits
            },
            message: "Mobile number must be exactly 10 digits",
        },
        require: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Faculty', 'Library', 'HOD'],
        require: true
    },
    // Common Fields
    gender: {
        type: String,
        require: true,
        enum: ['Male', 'Female']
    },
    address: {
        type: String,
        require: true,
    },
    admissionDate: {
        type: Date,
        require: true
    },
    dob: {
        type: String,
        require: true
    },
    // Student-Specific Fields
    SID: {
        type: String,
        required: function () {
            return this.role === 'Student';
        },
    },
    enrollmentNumber:{
        type:String
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        require: true
    },
    semester:
        [
            {
                type: String,
                enum: ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'],
                require: true
            }
        ],
        division: [
        {
            type: String,
            require: true,
        }
    ],
    // Faculty-Specific Fields
    HODId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HOD'
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        require: true
    }]
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next()
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.comparePassword = async function (passwordUser) {
    return await bcrypt.compare(passwordUser, this.password);
};

export const User = mongoose.model('User', userSchema)

