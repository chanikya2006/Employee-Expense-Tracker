const mongoose = require("mongoose");

const employeeExpenseSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmployeeExpense",
  employeeExpenseSchema
);