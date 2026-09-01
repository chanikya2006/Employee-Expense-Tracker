const express = require("express");
const router = express.Router();

const Employee = require("../models/employeeModel");
const EmployeeExpense = require("../models/employeeExpenseModel");
const authMiddleware = require("../middleware/expenseMiddleWare");

// ======================================
// MANAGER DASHBOARD ANALYTICS
// ======================================

router.get("/ANALYTICS", authMiddleware, async (req, res) => {
  try {

    // ======================================
    // 1. EMPLOYEE SUMMARY
    // ======================================

    const totalEmployees = await Employee.countDocuments();

    const activeEmployees = await Employee.countDocuments({
      status: "Active"
    });

    const salaryResult = await Employee.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$salary"
          }
        }
      }
    ]);

    const totalSalaries =
      salaryResult.length > 0
        ? salaryResult[0].total
        : 0;


    // ======================================
    // 2. TOTAL EMPLOYEE EXPENSES
    // ======================================

    const expenseResult = await EmployeeExpense.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      }
    ]);

    const totalExpenses =
      expenseResult.length > 0
        ? expenseResult[0].total
        : 0;


    // ======================================
    // 3. EXPENSE BY CATEGORY
    // ======================================

    const expenseByCategory = await EmployeeExpense.aggregate([
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount"
          }
        }
      },
      {
        $sort: {
          total: -1
        }
      }
    ]);


    // ======================================
    // 4. EXPENSE BY DEPARTMENT
    // ======================================

    const expenseByDepartment = await EmployeeExpense.aggregate([

      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employeeData"
        }
      },

      {
        $unwind: "$employeeData"
      },

      {
        $group: {
          _id: "$employeeData.department",
          total: {
            $sum: "$amount"
          }
        }
      },

      {
        $sort: {
          total: -1
        }
      }

    ]);


    // ======================================
    // 5. EMPLOYEE-WISE EXPENSE
    // ======================================

    const employeeExpenses = await EmployeeExpense.aggregate([

      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employeeData"
        }
      },

      {
        $unwind: "$employeeData"
      },

      {
        $group: {
          _id: "$employee",
          employeeName: {
            $first: "$employeeData.name"
          },
          employeeId: {
            $first: "$employeeData.employeeId"
          },
          department: {
            $first: "$employeeData.department"
          },
          totalExpense: {
            $sum: "$amount"
          },
          expenseCount: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          totalExpense: -1
        }
      }

    ]);


    // ======================================
    // 6. MONTHLY EXPENSES
    // ======================================

    const monthlyExpenses = await EmployeeExpense.aggregate([

      {
        $group: {
          _id: {
            year: {
              $year: "$expenseDate"
            },
            month: {
              $month: "$expenseDate"
            }
          },

          total: {
            $sum: "$amount"
          }
        }
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }

    ]);


    // ======================================
    // 7. RECENT EXPENSES
    // ======================================

    const recentExpenses = await EmployeeExpense
      .find()
      .populate(
        "employee",
        "name employeeId department"
      )
      .sort({
        expenseDate: -1
      })
      .limit(10);


    // ======================================
    // SEND RESPONSE
    // ======================================

    res.status(200).json({

      message: "Dashboard analytics fetched successfully",

      status: true,

      data: {

        totalEmployees,

        activeEmployees,

        totalSalaries,

        totalExpenses,

        expenseByCategory,

        expenseByDepartment,

        employeeExpenses,

        monthlyExpenses,

        recentExpenses

      }

    });

  } catch (error) {

    console.error("Dashboard analytics error:", error);

    res.status(500).json({

      message: error.message,

      status: false

    });

  }
});


module.exports = router;