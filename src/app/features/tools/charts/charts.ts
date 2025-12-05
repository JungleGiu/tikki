import { AfterViewInit, Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Ticket } from '../../../core/models/ticket';

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
  @ViewChild('departmentChart') departmentChart!: ElementRef<HTMLCanvasElement>;
  pChart!: Chart;
  dChart!: Chart;
  ngAfterViewInit(): void {
    this.createPriorityChart();
    this.createDepartmentChart();
  }
  createPriorityChart(): void {
    const chartData = this.getPriorityData();
    this.pChart = new Chart(this.priorityChart.nativeElement, {
      type: 'doughnut',

      data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
          {
            label: 'Tickets by Priority',
            data: chartData,
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  }

  createDepartmentChart(): void {
    const chartData = this.getDepartmentData();
    this.dChart = new Chart(this.departmentChart.nativeElement, {
      type: 'radar',
      data: {
        labels: ['IT', 'Sales', 'Management'],
        datasets: [
          {
            label: 'Tickets by Department',
            data: chartData,
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  }
  ngOnChanges(): void {
    if (this.pChart) {
      this.pChart.data.labels = ['Low', 'Medium', 'High'];
      this.pChart.data.datasets[0].data = this.getPriorityData();
      this.pChart.update();
    }
    if (this.dChart) {
      this.dChart.data.labels = ['IT', 'Sales', 'Management'];
      this.dChart.data.datasets[0].data = this.getDepartmentData();
      this.dChart.update();
    }
  }

  private getPriorityData(): number[] {
    const lowCount = this.data.filter((t) => t.priority === 1).length;
    const mediumCount = this.data.filter((t) => t.priority === 2).length;
    const highCount = this.data.filter((t) => t.priority >= 3).length;

    return [lowCount, mediumCount, highCount];
  }
  private getDepartmentData(): number[] {
    const itCount = this.data.filter((t) => t.department_id === 1).length;
    const salesCount = this.data.filter((t) => t.department_id === 2).length;
    const managementCount = this.data.filter((t) => t.department_id >= 3).length;

    return [itCount, salesCount, managementCount];
  }
}
