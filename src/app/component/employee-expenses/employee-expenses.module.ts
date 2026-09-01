import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';

import {
  EmployeeExpensesComponent
} from './employee-expenses.component';


const routes: Routes = [

  {
    path: '',
    component: EmployeeExpensesComponent,
    title: 'Employee Expenses | Expense Tracker'
  }

];


@NgModule({

  declarations: [

    EmployeeExpensesComponent

  ],

  imports: [

    CommonModule,

    ReactiveFormsModule,

    FormsModule,

    RouterModule.forChild(routes),

    MatCardModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatButtonModule,

    MatIconModule,

    MatProgressSpinnerModule,

    MatTooltipModule

  ]

})
export class EmployeeExpensesModule {}