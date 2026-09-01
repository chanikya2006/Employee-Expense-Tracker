import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-employee-expenses',
  templateUrl: './employee-expenses.component.html',
  styleUrls: ['./employee-expenses.component.scss']
})
export class EmployeeExpensesComponent implements OnInit {

  private apiUrl = environment.apiUrl;

  expenses: any[] = [];

  employees: any[] = [];

  filteredExpenses: any[] = [];

  selectedEmployee = '';

  selectedCategory = '';

  searchText = '';

  totalExpenses = 0;

  isLoading = false;


  // ==========================================
  // ADD EXPENSE
  // ==========================================

  expenseForm!: FormGroup;

  isAddingExpense = false;

  isSubmitting = false;


  categories = [
    'Food',
    'Accommodation',
    'Transportation',
    'Travel',
    'Medical',
    'Office',
    'Entertainment',
    'Other'
  ];


  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}


  ngOnInit(): void {

    // Initialize Add Expense form
    this.expenseForm = this.fb.group({

      employeeId: [
        '',
        Validators.required
      ],

      amount: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      category: [
        '',
        Validators.required
      ],

      expenseDate: [
        '',
        Validators.required
      ],

      description: [
        ''
      ]

    });


    this.loadEmployees();

    this.loadExpenses();

  }


  // ==========================================
  // OPEN ADD EXPENSE FORM
  // ==========================================

  openAddExpense(): void {

    this.isAddingExpense = true;

    this.expenseForm.reset();

  }


  // ==========================================
  // CANCEL ADD EXPENSE
  // ==========================================

  cancelAddExpense(): void {

    this.isAddingExpense = false;

    this.expenseForm.reset();

  }


  // ==========================================
  // ADD EXPENSE
  // ==========================================

  addExpense(): void {

    if (this.expenseForm.invalid) {

      this.expenseForm.markAllAsTouched();

      return;

    }


    this.isSubmitting = true;


    const expenseData = {

      employeeId:
        this.expenseForm.value.employeeId,

      amount:
        Number(this.expenseForm.value.amount),

      category:
        this.expenseForm.value.category,

      expenseDate:
        this.expenseForm.value.expenseDate,

      description:
        this.expenseForm.value.description

    };


    console.log(
      'Adding employee expense:',
      expenseData
    );


    this.http
      .post(
        this.apiUrl +
        'EMPLOYEE_EXPENSE/ADD_EXPENSE',
        expenseData
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Expense added:',
            response
          );


          if (response.status) {

            alert(
              'Expense added successfully'
            );


            // Reset form
            this.expenseForm.reset();


            // Close form
            this.isAddingExpense = false;


            // Reset submitting state
            this.isSubmitting = false;


            // Reload expense list
            this.loadExpenses();

          }

          else {

            alert(
              response.message ||
              'Unable to add expense'
            );

            this.isSubmitting = false;

          }

        },


        error: (error) => {

          console.error(
            'Error adding expense:',
            error
          );


          alert(
            error.error?.message ||
            'Unable to add expense'
          );


          this.isSubmitting = false;

        }

      });

  }


  // ==========================================
  // GET ALL EMPLOYEES
  // ==========================================

  loadEmployees(): void {

    this.http
      .get(
        this.apiUrl +
        'EMPLOYEE/GET_ALL_EMPLOYEES'
      )
      .subscribe({

        next: (response: any) => {

          if (response.status) {

            this.employees =
              response.data;

          }

        },

        error: (error) => {

          console.error(
            'Error loading employees:',
            error
          );

        }

      });

  }


  // ==========================================
  // GET ALL EXPENSES
  // ==========================================

  loadExpenses(): void {

    this.isLoading = true;

    this.http
      .get(
        this.apiUrl +
        'EMPLOYEE_EXPENSE/GET_ALL_EXPENSES'
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Employee expenses:',
            response
          );


          if (response.status) {

            this.expenses =
              response.data || [];

            this.filteredExpenses = [
              ...this.expenses
            ];

            this.calculateTotal();

          }

          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'Error loading expenses:',
            error
          );

          this.isLoading = false;

        }

      });

  }


  // ==========================================
  // FILTER EXPENSES
  // ==========================================

  applyFilters(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredExpenses =
      this.expenses.filter(
        (expense: any) => {

          const employee =
            expense.employee || {};


          const matchesSearch =
            !search ||

            employee.name
              ?.toLowerCase()
              .includes(search) ||

            employee.employeeId
              ?.toLowerCase()
              .includes(search) ||

            expense.description
              ?.toLowerCase()
              .includes(search);


          const matchesEmployee =
            !this.selectedEmployee ||

            employee._id ===
            this.selectedEmployee;


          const matchesCategory =
            !this.selectedCategory ||

            expense.category ===
            this.selectedCategory;


          return (
            matchesSearch &&
            matchesEmployee &&
            matchesCategory
          );

        }
      );


    this.calculateFilteredTotal();

  }


  // ==========================================
  // TOTAL EXPENSE
  // ==========================================

  calculateTotal(): void {

    this.totalExpenses =
      this.expenses.reduce(
        (
          total: number,
          expense: any
        ) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );

  }


  calculateFilteredTotal(): void {

    this.totalExpenses =
      this.filteredExpenses.reduce(
        (
          total: number,
          expense: any
        ) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );

  }


  // ==========================================
  // DELETE EXPENSE
  // ==========================================

  deleteExpense(
    id: string
  ): void {

    const confirmDelete =
      confirm(
        'Are you sure you want to delete this expense?'
      );


    if (!confirmDelete) {

      return;

    }


    this.http
      .delete(
        this.apiUrl +
        'EMPLOYEE_EXPENSE/DELETE_EXPENSE/' +
        id
      )
      .subscribe({

        next: (response: any) => {

          alert(
            'Expense deleted successfully'
          );

          this.loadExpenses();

        },


        error: (error) => {

          console.error(
            'Error deleting expense:',
            error
          );

          alert(
            error.error?.message ||
            'Unable to delete expense'
          );

        }

      });

  }


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedEmployee = '';

    this.selectedCategory = '';

    this.filteredExpenses = [
      ...this.expenses
    ];

    this.calculateTotal();

  }

}