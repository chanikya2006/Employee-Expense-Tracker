const express = require("express");
const router = express.Router();

const EmployeeExpense = require("../models/employeeExpenseModel");
const Employee = require("../models/employeeModel");
const authMiddleware = require("../middleware/expenseMiddleWare");


// ======================================
// ADD EMPLOYEE EXPENSE
// ======================================

router.post("/ADD_EXPENSE", authMiddleware, async (req, res) => {
  try {

    const {
      employeeId,
      amount,
      category,
      expenseDate,
      description
    } = req.body;

    // Check whether employee exists
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false
      });
    }

    const expense = new EmployeeExpense({
      employee: employeeId,
      amount: amount,
      category: category,
      expenseDate: expenseDate,
      description: description
    });

    const result = await expense.save();

    res.status(201).json({
      message: "Employee expense added successfully",
      status: true,
      data: result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
      status: false
    });
  }
});

// ======================================
// GET ALL EMPLOYEE EXPENSES
// ======================================

router.get(
  "/GET_ALL_EXPENSES",
  authMiddleware,
  async (req, res) => {

    try {

      const expenses = await EmployeeExpense
        .find()
        .populate(
          "employee",
          "name employeeId department designation"
        )
        .sort({
          expenseDate: -1
        });

      res.status(200).json({

        message: "All employee expenses fetched successfully",

        status: true,

        data: expenses

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message: error.message,

        status: false

      });

    }

  }
);


// ======================================
// GET ALL EXPENSES OF AN EMPLOYEE
// ======================================

router.get(
  "/GET_EMPLOYEE_EXPENSES/:employeeId",
  authMiddleware,
  async (req, res) => {

    try {

      const expenses = await EmployeeExpense
        .find({ employee: req.params.employeeId })
        .sort({ expenseDate: -1 });

      res.status(200).json({
        message: "Employee expenses fetched successfully",
        status: true,
        data: expenses
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
        status: false
      });
    }
  }
);


// ======================================
// DELETE EMPLOYEE EXPENSE
// ======================================

router.delete(
  "/DELETE_EXPENSE/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const expense =
        await EmployeeExpense.findByIdAndDelete(req.params.id);

      if (!expense) {
        return res.status(404).json({
          message: "Expense not found",
          status: false
        });
      }

      res.status(200).json({
        message: "Employee expense deleted successfully",
        status: true
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
        status: false
      });
    }
  }
);

// ======================================
// EMPLOYEE DASHBOARD ANALYTICS
// ======================================

router.get(
  "/DASHBOARD_ANALYTICS",
  authMiddleware,
  async (req, res) => {

    try {

      // Get all employees
      const employees = await Employee.find();

      // Get all employee expenses
      const expenses = await EmployeeExpense
        .find()
        .populate(
          "employee",
          "name employeeId department salary"
        );


      // ===============================
      // BASIC STATISTICS
      // ===============================

      const totalEmployees = employees.length;

      const activeEmployees = employees.filter(
        employee => employee.status === "Active"
      ).length;

      const inactiveEmployees =
        totalEmployees - activeEmployees;


      const totalSalary = employees.reduce(
        (total, employee) =>
          total + Number(employee.salary || 0),
        0
      );


      const totalExpenses = expenses.reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );


      const totalCompanyCost =
        totalSalary + totalExpenses;


      // ===============================
      // EXPENSE BY CATEGORY
      // ===============================

      const categoryMap = {};

      expenses.forEach(expense => {

        const category = expense.category || "Other";

        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }

        categoryMap[category] +=
          Number(expense.amount || 0);

      });


      const categoryExpenses =
        Object.entries(categoryMap)
          .map(([category, amount]) => ({
            category,
            amount
          }))
          .sort((a, b) => b.amount - a.amount);


      // ===============================
      // EXPENSE BY DEPARTMENT
      // ===============================

      const departmentMap = {};

      expenses.forEach(expense => {

        if (!expense.employee) {
          return;
        }

        const department =
          expense.employee.department || "Other";

        if (!departmentMap[department]) {
          departmentMap[department] = 0;
        }

        departmentMap[department] +=
          Number(expense.amount || 0);

      });


      const departmentExpenses =
        Object.entries(departmentMap)
          .map(([department, amount]) => ({
            department,
            amount
          }))
          .sort((a, b) => b.amount - a.amount);


      // ===============================
      // EXPENSE BY EMPLOYEE
      // ===============================

      const employeeMap = {};

      expenses.forEach(expense => {

        if (!expense.employee) {
          return;
        }

        const id =
          expense.employee._id.toString();

        if (!employeeMap[id]) {

          employeeMap[id] = {

            employeeId:
              expense.employee.employeeId,

            name:
              expense.employee.name,

            department:
              expense.employee.department,

            salary:
              expense.employee.salary,

            expenses: 0

          };

        }

        employeeMap[id].expenses +=
          Number(expense.amount || 0);

      });


      const employeeExpenses =
        Object.values(employeeMap)
          .sort((a, b) =>
            b.expenses - a.expenses
          );


      // ===============================
      // MONTHLY EXPENSES
      // ===============================

      const monthlyMap = {};

      expenses.forEach(expense => {

        const date =
          new Date(expense.expenseDate);

        if (isNaN(date.getTime())) {
          return;
        }

        const month =
          date.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
          });

        if (!monthlyMap[month]) {
          monthlyMap[month] = 0;
        }

        monthlyMap[month] +=
          Number(expense.amount || 0);

      });


      const monthlyExpenses =
        Object.entries(monthlyMap)
          .map(([month, amount]) => ({
            month,
            amount
          }));


      // ===============================
      // SEND RESPONSE
      // ===============================

      res.status(200).json({

        message:
          "Dashboard analytics fetched successfully",

        status: true,

        data: {

          totalEmployees,

          activeEmployees,

          inactiveEmployees,

          totalSalary,

          totalExpenses,

          totalCompanyCost,

          categoryExpenses,

          departmentExpenses,

          employeeExpenses,

          monthlyExpenses

        }

      });

    } catch (error) {

      console.error(
        "Dashboard analytics error:",
        error
      );

      res.status(500).json({

        message: error.message,

        status: false

      });

    }

  }
);


module.exports = router;