import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { AddExpenseComponent } from './component/header/add-expense/add-expense.component';
import { EmployeeComponent } from './component/employee/employee.component';

import { ManagerLayoutComponent } from './component/manager-layout/manager-layout.component';
import { SignupComponent } from './component/welcome/signup/signup.component';

const routes: Routes = [

  // =====================================
  // WELCOME / LOGIN / SIGN UP
  // PUBLIC ROUTE
  // =====================================

  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },

  {
    path: 'welcome',
    loadChildren: () =>
      import('./component/welcome/welcome.module')
        .then(m => m.WelcomeModule)
  },


  // =====================================
  // MANAGER APPLICATION
  // PROTECTED ROUTE
  // =====================================

  {
    path: '',
    component: ManagerLayoutComponent,
    canActivate: [AuthGuard],

    children: [

      // ==============================
      // DASHBOARD
      // ==============================

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./component/home/home.module')
            .then(m => m.HomeModule)
      },


      // ==============================
      // ADD EMPLOYEE
      // ==============================

      {
        path: 'add-employee',
        loadChildren: () =>
          import('./component/add-employee/add-employee.module')
            .then(m => m.AddEmployeeModule)
      },


      // ==============================
      // EMPLOYEES
      // ==============================

      {
        path: 'employees',
        component: EmployeeComponent,
        title: 'Employees | Expense Tracker'
      },


      // ==============================
      // EMPLOYEE EXPENSES
      // ==============================

      {
        path: 'employee-expenses',
        loadChildren: () =>
          import('./component/employee-expenses/employee-expenses.module')
            .then(m => m.EmployeeExpensesModule)
      }

    ]
  },


  // =====================================
  // EDIT EMPLOYEE
  // =====================================

  {
    path: 'add-employee/:id',
    loadChildren: () =>
      import('./component/add-employee/add-employee.module')
        .then(m => m.AddEmployeeModule),

    canActivate: [AuthGuard],

    title: 'Edit Employee | Expense Tracker'
  },


  // =====================================
  // OLD EXPENSE EDIT
  // =====================================

  {
    path: 'edit/:id',
    component: AddExpenseComponent,
    canActivate: [AuthGuard],
    title: 'Edit Expense | ExpenseTracker'
  },

  {
  path: 'signup',
  component: SignupComponent,
  title: 'Sign Up | Expense Tracker'
  },


  // =====================================
  // FALLBACK
  // =====================================

  {
    path: '**',
    redirectTo: 'welcome'
  }

];


@NgModule({

  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ],

  providers: [
    AuthGuard
  ]

})
export class AppRoutingModule {}