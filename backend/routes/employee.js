const express = require("express");
const router = express.Router();

const Employee = require("../models/employeeModel");
const authMiddleware = require("../middleware/expenseMiddleWare");


// ===============================
// ADD EMPLOYEE
// ===============================

router.post("/ADD_EMPLOYEE", authMiddleware, async (req, res) => {
  try {
    const employee = new Employee({
      employeeId: req.body.employeeId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
      designation: req.body.designation,
      joiningDate: req.body.joiningDate,
      salary: req.body.salary,
      status: req.body.status || "Active",
    });

    const result = await employee.save();

    res.status(201).json({
      message: "Employee added successfully",
      status: true,
      data: result,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});


// ===============================
// GET ALL EMPLOYEES
// ===============================

router.get("/GET_ALL_EMPLOYEES", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Employees fetched successfully",
      status: true,
      data: employees,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});


// ===============================
// GET SINGLE EMPLOYEE
// ===============================

router.get("/GET_EMPLOYEE/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "Employee fetched successfully",
      status: true,
      data: employee,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});


// ===============================
// UPDATE EMPLOYEE
// ===============================

router.patch("/UPDATE_EMPLOYEE/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      status: true,
      data: employee,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});


// ===============================
// DELETE EMPLOYEE
// ===============================

router.delete("/DELETE_EMPLOYEE/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        status: false,
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      status: true,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
});


module.exports = router;