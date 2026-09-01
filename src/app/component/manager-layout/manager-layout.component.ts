import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-manager-layout',
  templateUrl: './manager-layout.component.html',
  styleUrls: ['./manager-layout.component.scss']
})
export class ManagerLayoutComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isActive(route: string): boolean {
  return this.router.url === route ||
         this.router.url.startsWith(route + '/');
}

  onDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onAddEmployee() {
    this.router.navigate(['/add-employee']);
  }

  onEmployees() {
    this.router.navigate(['/employees']);
  }

  onEmployeeExpenses() {
    this.router.navigate(['/employee-expenses']);
  }

  onProfile() {
    this.router.navigate(['/home']);
  }

  onLogout() {
    this.authService.onLogout();
  }

}