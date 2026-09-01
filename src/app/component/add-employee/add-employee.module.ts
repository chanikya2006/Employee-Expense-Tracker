import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AddEmployeeComponent } from './add-employee.component';

const routes: Routes = [
  {
    path: '',
    component: AddEmployeeComponent,
    title: 'Add Employee | Expense Tracker'
  }
];

@NgModule({

  declarations: [
    AddEmployeeComponent
  ],

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterModule.forChild(routes),

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule

  ]

})
export class AddEmployeeModule {}