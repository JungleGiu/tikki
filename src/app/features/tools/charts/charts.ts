import {
  AfterViewInit,
  Component,
  Input,
  inject,
  ViewChild,
  ElementRef,
  OnChanges,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Ticket } from '../../../core/models/ticket';
import { supabaseAuth } from '../../../core/services/supabase/supabaseAuth';
Chart.register(...registerables);
@Component({
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class Charts implements AfterViewInit, OnChanges {
  @Input() data!: Ticket[];
  @ViewChild('priorityChart') priorityChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('departmentChart')
  departmentChart?: ElementRef<HTMLCanvasElement>;
  supabaseAuth = inject(supabaseAuth);
  userRole = this.supabaseAuth.appUser()?.role_id;
  pChart!: Chart;
  dChart!: Chart;
  ngAfterViewInit(): void {
    this.createPriorityChart();
    if (this.departmentChart) {
      this.createDepartmentChart();
    }
  }
  createPriorityChart(): void {
    const chartData = this.getPriorityData();
    this.pChart = new Chart(this.priorityChart.nativeElement, {
      type: 'doughnut',

      data: {
        labels: ['Low', 'Medium', 'High', 'Critical'],
        datasets: [
          {
            label: 'Tickets by Priority',
            data: chartData,
            backgroundColor: ['#3b82f6', '#f5e20b', '#f6993b', '#ef4444'],
            borderColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  }

  createDepartmentChart(): void {
    if (!this.departmentChart) return;
    const chartData = this.getDepartmentData();
    this.dChart = new Chart(this.departmentChart.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['IT', 'HR', 'Sales', 'Marketing'],
        datasets: [
          {
            label: 'Tickets by Department',
            data: chartData,
            backgroundColor: ['#c084fc', '#4ade80', '#fb923c', '#60a5fa'],
            borderColor: [
              'rgba(192, 132, 252, 0.2)',
              'rgba(74, 222, 128, 0.2)',
              'rgba(251, 146, 60, 0.2)',
              'rgba(96, 165, 250, 0.2)',
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  }
  ngOnChanges(): void {
    if (this.pChart) {
      this.pChart.data.labels = ['Low', 'Medium', 'High', 'Critical'];
      this.pChart.data.datasets[0].data = this.getPriorityData();
      this.pChart.update();
    }
    if (this.dChart && this.departmentChart) {
      this.dChart.data.labels = ['IT', 'HR', 'Sales', 'Marketing'];
      this.dChart.data.datasets[0].data = this.getDepartmentData();
      this.dChart.update();
    }
  }

  private getPriorityData(): number[] {
    const lowCount = this.data.filter((t) => t.priority === 4).length;
    const mediumCount = this.data.filter((t) => t.priority === 3).length;
    const highCount = this.data.filter((t) => t.priority === 2).length;
    const criticalCount = this.data.filter((t) => t.priority === 1).length;

    return [lowCount, mediumCount, highCount, criticalCount];
  }
  private getDepartmentData(): number[] {
    const itCount = this.data.filter((t) => t.department_id === 1).length;
    const HRCount = this.data.filter((t) => t.department_id === 2).length;
    const salesCount = this.data.filter((t) => t.department_id === 3).length;
    const marketingCount = this.data.filter((t) => t.department_id === 4).length;

    return [itCount, HRCount, salesCount, marketingCount];
  }
}
