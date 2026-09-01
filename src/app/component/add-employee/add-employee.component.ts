import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  BusinessDataService
} from '../../services/business-data.service';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  employeeForm!: FormGroup;

  isSubmitting = false;

  // tells us whether this is Add or Edit
  isEditing = false;

  // employee ID from URL
  employeeId!: string;


  constructor(
    private fb: FormBuilder,
    private businessDataService: BusinessDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {

    // ==========================================
    // CREATE FORM
    // ==========================================

    this.employeeForm = this.fb.group({

      employeeId: ['', Validators.required],

      name: ['', Validators.required],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      phone: ['', Validators.required],

      department: ['', Validators.required],

      designation: ['', Validators.required],

      joiningDate: ['', Validators.required],

      salary: ['', [
        Validators.required,
        Validators.min(0)
      ]],

      status: ['Active', Validators.required]

    });


    // ==========================================
    // CHECK WHETHER WE ARE EDITING
    // ==========================================

    this.employeeId =
      this.route.snapshot.paramMap.get('id') || '';


    if (this.employeeId) {

      this.isEditing = true;

      this.loadEmployee();

    }

  }


  // ==========================================
  // LOAD EMPLOYEE FOR EDITING
  // ==========================================

  loadEmployee(): void {

    this.businessDataService
      .getEmployee(this.employeeId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Employee loaded:',
            response
          );


          if (response.status) {

            const employee =
              response.data;


            this.employeeForm.patchValue({

              employeeId:
                employee.employeeId,

              name:
                employee.name,

              email:
                employee.email,

              phone:
                employee.phone,

              department:
                employee.department,

              designation:
                employee.designation,

              joiningDate:
                employee.joiningDate
                  ? employee.joiningDate.substring(0, 10)
                  : '',

              salary:
                employee.salary,

              status:
                employee.status

            });

          }

        },

        error: (error) => {

          console.error(
            'Error loading employee:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to load employee'
          );

          this.router.navigate([
            '/employees'
          ]);

        }

      });

  }


  // ==========================================
  // ADD EMPLOYEE
  // ==========================================

  addEmployee(): void {

    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();

      return;

    }


    this.isSubmitting = true;


    const employee =
      this.employeeForm.value;


    // ==========================================
    // EDIT MODE
    // ==========================================

    if (this.isEditing) {

      this.businessDataService
        .updateEmployee(
          this.employeeId,
          employee
        )
        .subscribe({

          next: (response: any) => {

            console.log(
              'Employee updated:',
              response
            );

            alert(
              'Employee updated successfully'
            );

            this.isSubmitting = false;

            this.router.navigate([
              '/employees'
            ]);

          },

          error: (error) => {

            console.error(
              'Error updating employee:',
              error
            );

            alert(
              error?.error?.message ||
              'Failed to update employee'
            );

            this.isSubmitting = false;

          }

        });

      return;

    }


    // ==========================================
    // ADD MODE
    // ==========================================

    this.businessDataService
      .addEmployee(employee)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Employee added:',
            response
          );

          alert(
            'Employee added successfully'
          );


          this.employeeForm.reset({
            status: 'Active'
          });


          this.isSubmitting = false;


          this.router.navigate([
            '/employees'
          ]);

        },

        error: (error) => {

          console.error(
            'Error adding employee:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to add employee'
          );

          this.isSubmitting = false;

        }

      });

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {

    this.router.navigate([
      '/employees'
    ]);

  }

}