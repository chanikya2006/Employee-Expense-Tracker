import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { BusinessDataService }
  from 'src/app/services/business-data.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  employees: any[] = [];

  activeEmployees = 0;

  totalSalary = 0;


  constructor(
    private businessData: BusinessDataService,
    private router : Router
  ) {}


  ngOnInit(): void {

    this.loadEmployees();

  }


  // ==========================================
  // LOAD ALL EMPLOYEES
  // ==========================================

  loadEmployees(): void {

    this.businessData
      .getAllEmployees()
      .subscribe({

        next: (response: any) => {

          console.log(
            'Employees response:',
            response
          );


          if (response.status) {

            this.employees =
              response.data || [];


            this.calculateSummary();

          }

        },


        error: (error) => {

          console.error(
            'Error fetching employees:',
            error
          );

        }

      });

  }


  // ==========================================
  // CALCULATE SUMMARY
  // ==========================================

  calculateSummary(): void {

    this.activeEmployees =
      this.employees.filter(
        (employee: any) =>
          employee.status === 'Active'
      ).length;


    this.totalSalary =
      this.employees.reduce(
        (
          total: number,
          employee: any
        ) => {

          return total +
            Number(employee.salary || 0);

        },
        0
      );

  }


  // ==========================================
  // EDIT EMPLOYEE
  // ==========================================

editEmployee(employee: any): void {

  this.router.navigate([
    '/add-employee',
    employee._id
  ]);

}

  // ==========================================
  // DELETE EMPLOYEE
  // ==========================================

  deleteEmployee(id: string): void {

    const confirmDelete =
      confirm(
        'Are you sure you want to delete this employee?'
      );


    if (!confirmDelete) {

      return;

    }


    this.businessData
      .deleteEmployee(id)
      .subscribe({

        next: (response: any) => {

          alert(
            'Employee deleted successfully'
          );


          this.loadEmployees();

        },


        error: (error) => {

          console.error(
            'Error deleting employee:',
            error
          );


          alert(
            error.error?.message ||
            'Unable to delete employee'
          );

        }

      });

  }

}