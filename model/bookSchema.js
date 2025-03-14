import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    issuedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    isbn: {
        type: Date.now(),
        require: true,
    },
    issueDate: {
        type: String,
        require: true
    },
    returnDate: {
        type: Date.now(),
        require: true,
    },
    penalti: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true
            },
            amount: {
                type: String,
                require: true
            }
        }
    ]
})

bookSchema.pre('save', function (next) {
    if (this.issueDate < this.isbn) {
        return next(new Error('Issue date must be after ISBN date.'));
    }
    next();
});

// Function to add penalty only if amount is greater than $50
bookIssueSchema.methods.addPenalty = function (userId, amount) {
    if (amount == 50) {
        this.penalty.push({ userId, amount });
    }
};

export const Book = mongoose.model('Book',bookSchema)