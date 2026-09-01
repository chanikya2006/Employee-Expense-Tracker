import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ManagerLayoutComponent } from './manager-layout.component';

@NgModule({

  declarations: [
    ManagerLayoutComponent
  ],

  imports: [
    CommonModule,
    RouterModule,

    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],

  exports: [
    ManagerLayoutComponent
  ]

})
export class ManagerLayoutModule {}