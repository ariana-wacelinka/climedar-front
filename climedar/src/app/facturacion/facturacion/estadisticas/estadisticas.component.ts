import { ReactiveFormsModule } from '@angular/forms';
import { Color } from './../../../../../node_modules/@swimlane/ngx-charts/lib/utils/color-sets.d';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { PiechartComponent } from "./piechart/piechart.component";

@Component({
  selector: 'app-estadisticas',
  imports: [PiechartComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasComponent {

}
