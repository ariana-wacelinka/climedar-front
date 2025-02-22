import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-piechart',
  imports: [NgxChartsModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatButtonToggleModule, MatSelectModule],
  providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'es-AR'},
        provideMomentDateAdapter(),
      ],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss'
})
export class PiechartComponent {
  pieChartRevenueControl = new FormGroup({
    date: new FormControl('', []),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    revenueType: new FormControl('DAILY'),
    specialityName: new FormControl(''),
    serviceType: new FormControl(''),
    originName: new FormControl(''),
  })
  legendPosition = LegendPosition.Right;
  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];

  view: [number,number] = [600, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
  }

  onSelect(event: Event) {
    console.log(event);
    console.log(this.pieChartRevenueControl.value.originName)
  }
}
