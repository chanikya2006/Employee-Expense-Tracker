import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { AlertBoxComponent } from 'src/app/shared/alert-box/alert-box.component';
import { ProfileComponent } from 'src/app/shared/profile/profile.component';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  isLogging: any;
  app_version: any;

  // ===============================
  // DASHBOARD DATA
  // ===============================

  dashboardData: any = null;

  totalEmployees: number = 0;
  activeEmployees: number = 0;
  inactiveEmployees: number = 0;

  totalSalaries: number = 0;
  totalExpenses: number = 0;


  // ===============================
  // PROFESSIONAL COLORS
  // ===============================

  private readonly chartColors = [
    '#0F766E', // Teal
    '#7C3AED', // Purple
    '#D97706', // Amber
    '#15803D', // Green
    '#475569', // Slate
    '#B45309', // Dark Amber
    '#9333EA', // Violet
    '#047857'  // Emerald
  ];


  // ===============================
  // EXPENSE CATEGORY CHART
  // ===============================

  public categoryChartType: 'pie' = 'pie';

  public categoryChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: this.chartColors,
        borderColor: '#FFFFFF',
        borderWidth: 2
      }
    ]
  };

  public categoryChartOptions: ChartConfiguration<'pie'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'bottom'
      }
    }

  };


  // ===============================
  // EXPENSE BY DEPARTMENT CHART
  // ===============================

  public departmentChartType: 'bar' = 'bar';

  public departmentChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Expenses',
        backgroundColor: '#0F766E',
        borderColor: '#0B5F59',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  public departmentChartOptions: ChartConfiguration<'bar'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {

      y: {
        beginAtZero: true,

        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }

    }

  };


  // ===============================
  // MONTHLY EXPENSE TREND
  // ===============================

  public monthlyChartType: 'line' = 'line';

  public monthlyChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Monthly Expenses',

        borderColor: '#7C3AED',

        backgroundColor: 'rgba(124, 58, 237, 0.10)',

        pointBackgroundColor: '#7C3AED',

        pointBorderColor: '#FFFFFF',

        pointBorderWidth: 2,

        pointRadius: 4,

        borderWidth: 3,

        fill: false,

        tension: 0.3
      }
    ]
  };

  public monthlyChartOptions: ChartConfiguration<'line'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },

    scales: {

      y: {
        beginAtZero: true,

        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }

    }

  };


  // ===============================
  // EMPLOYEE EXPENSE RANKING
  // ===============================

  public employeeChartType: 'bar' = 'bar';

  public employeeChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total Expenses',

        backgroundColor: '#D97706',

        borderColor: '#B45309',

        borderWidth: 1,

        borderRadius: 6
      }
    ]
  };

  public employeeChartOptions: ChartConfiguration<'bar'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    indexAxis: 'y',

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {

      x: {
        beginAtZero: true,

        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }

    }

  };


  // ===============================
  // CONSTRUCTOR
  // ===============================

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public businessData: BusinessDataService
  ) {}


  // ===============================
  // LOAD DASHBOARD
  // ===============================

  loadDashboard() {

    this.businessData.getDashboardAnalytics().subscribe({

      next: (response: any) => {

        console.log('Dashboard response:', response);

        if (response.status) {

          // Store complete response
          this.dashboardData = response.data;


          // ===============================
          // SUMMARY DATA
          // ===============================

          this.totalEmployees =
            response.data.totalEmployees || 0;

          this.activeEmployees =
            response.data.activeEmployees || 0;

          this.inactiveEmployees =
            response.data.inactiveEmployees ||
            (this.totalEmployees - this.activeEmployees);

          this.totalSalaries =
            response.data.totalSalaries || 0;

          this.totalExpenses =
            response.data.totalExpenses || 0;

        }


        // ===============================
        // CATEGORY CHART DATA
        // ===============================

        const categoryData =
          response.data.expenseByCategory || [];

        this.categoryChartData = {

          labels: categoryData.map(
            (item: any) => item._id
          ),

          datasets: [
            {
              data: categoryData.map(
                (item: any) => item.total
              ),

              backgroundColor: this.chartColors,

              borderColor: '#FFFFFF',

              borderWidth: 2
            }
          ]

        };


        // ===============================
        // DEPARTMENT CHART DATA
        // ===============================

        const departmentData =
          response.data.expenseByDepartment || [];

        this.departmentChartData = {

          labels: departmentData.map(
            (item: any) => item._id
          ),

          datasets: [
            {
              data: departmentData.map(
                (item: any) => item.total
              ),

              label: 'Expenses',

              backgroundColor: '#0F766E',

              borderColor: '#0B5F59',

              borderWidth: 1,

              borderRadius: 6
            }
          ]

        };


        // ===============================
        // MONTHLY EXPENSE CHART DATA
        // ===============================

        const monthlyData =
          response.data.monthlyExpenses || [];

        this.monthlyChartData = {

          labels: monthlyData.map((item: any) => {

            const month = item._id.month;
            const year = item._id.year;

            const date = new Date(year, month - 1);

            return date.toLocaleString('default', {
              month: 'short'
            }) + ' ' + year;

          }),

          datasets: [
            {
              data: monthlyData.map(
                (item: any) => item.total
              ),

              label: 'Monthly Expenses',

              borderColor: '#7C3AED',

              backgroundColor:
                'rgba(124, 58, 237, 0.10)',

              pointBackgroundColor:
                '#7C3AED',

              pointBorderColor:
                '#FFFFFF',

              pointBorderWidth: 2,

              pointRadius: 4,

              borderWidth: 3,

              fill: false,

              tension: 0.3
            }
          ]

        };


        // ===============================
        // EMPLOYEE EXPENSE RANKING DATA
        // ===============================

        const employeeData =
          response.data.employeeExpenses || [];

        this.employeeChartData = {

          labels: employeeData.map(
            (item: any) =>
              item.employeeName +
              ' (' +
              item.employeeId +
              ')'
          ),

          datasets: [
            {
              data: employeeData.map(
                (item: any) => item.totalExpense
              ),

              label: 'Total Expenses',

              backgroundColor: '#D97706',

              borderColor: '#B45309',

              borderWidth: 1,

              borderRadius: 6
            }
          ]

        };

      },


      error: (error) => {

        console.error(
          'Error loading dashboard:',
          error
        );

      }

    });

  }


  // ===============================
  // INITIALIZATION
  // ===============================

  ngOnInit(): void {

    const token =
      sessionStorage.getItem('LEAD_ID');

    this.authService.authAfterReferesh(
      true,
      token
    );

    this.app_version =
      sessionStorage.getItem('Version');

    // Load dashboard data
    this.loadDashboard();

  }


  // ===============================
  // ADD EMPLOYEE
  // ===============================

  onAddEmployee() {

    this.businessData.onNavigate(
      'employees'
    );

  }


  onEmployeeExpenses() {

    this.businessData.onNavigate(
      'employee-expenses'
    );

  }


  // ===============================
  // PROFILE
  // ===============================

  Profile() {

    this.openDialog();

  }


  openDialog(): void {

    this.dialog.open(
      ProfileComponent,
      {
        width: '600px'
      }
    );

  }


  // ===============================
  // LOGOUT
  // ===============================

  onLogout() {

    this.dialog.open(
      AlertBoxComponent,
      {
        data: {
          type: 'alert'
        }
      }
    );

  }


  // ===============================
  // GITHUB
  // ===============================

  onGithub() {

    this.businessData.onGithub();

  }


  // ===============================
  // LINKEDIN
  // ===============================

  onLinkedin() {

    this.businessData.onLinkedin();

  }

}