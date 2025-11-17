import { AfterViewInit, Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import { Ticket } from '../../../../../core/models/ticket';

Chart.register(...registerables);
@Component({
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class Charts implements AfterViewInit, OnChanges {
@Input() data !: Ticket[];
@ViewChild('priorityChart') priorityChart !: ElementRef<HTMLCanvasElement>;
chart !: Chart;

ngAfterViewInit(): void {
  this.createChart();
}
 createChart(): void {
  const chartData = this.getPriorityData();
   this.chart = new Chart(this.priorityChart.nativeElement, {
     type:'doughnut',
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
     }
   })
 }

 ngOnChanges(): void {
    if (this.chart) {
      this.chart.data.labels = ['Low', 'Medium', 'High'];
      this.chart.data.datasets[0].data = this.data.map(row => row.priority);
      this.chart.update();
    }
  }

  private getPriorityData(): number[] {
  const lowCount = this.data.filter(t => t.priority === 1).length;
  const mediumCount = this.data.filter(t => t.priority === 2).length;
  const highCount = this.data.filter(t => t.priority >= 3).length;
  
  return [lowCount, mediumCount, highCount];
}
}
