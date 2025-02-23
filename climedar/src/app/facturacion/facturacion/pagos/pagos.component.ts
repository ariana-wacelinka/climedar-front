import { Component, signal, WritableSignal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { CenteredCardComponent } from '../../../shared/components';
import { FormControl, FormsModule, NgModel, NgModelGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MedicalServiceResponse } from '../../../servicio/models/services.models';
import { map, Observable } from 'rxjs';
import { PatientService } from '../../../patients/services/patient.service';
import { ServiciosMedicosService } from '../../../servicio/services/servicio/servicios-medicos.service';
import { PaymentService } from '../../../shared/services/payment/payment.service';
import { Payment } from '../../models/payment.model';
import { PageInfo } from '../../../shared/models/extras.models';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-pagos',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatMenuTrigger,
    MatMenuModule,
    MatInputModule,
    ReactiveFormsModule,
    PaginatorComponent,
    FormsModule
  ],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class PagosComponent {
  displayedColumns: string[] = ["date", "paciente", "paymentMethod", "price", "edit"];

  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });

  servicioControl = new FormControl('', Validators.required);
  filteredServiciosOption: Observable<MedicalServiceResponse[]> | undefined;

  pacienteControl = new FormControl('', Validators.required);
  filteredPacientesOption: Observable<MedicalServiceResponse[]> | undefined;

  startDateControl = new FormControl('', Validators.required);
  endDateControl = new FormControl('', Validators.required);

  payments = signal<Payment[]>([]);

  startDate: string = "";
  endDate: string = "";


  constructor(private pacienteService: PatientService,
    private servicioService: ServiciosMedicosService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
  }

  cancelarPago(pago: Payment) {
    this.paymentService.cancelPayment(pago).subscribe(() => {
    });
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.paymentService.getAllPayments(page, "", "").pipe(
      map(response => response)
    ).subscribe(response => {
      this.payments.set(response.payments);
      this.pageInfo.set(response.pageInfo);
    });
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage);
  }

  onSelectedDate(event: MatDatepickerInputEvent<Date>) {
    this.pageInfo.set({ totalItems: 0, currentPage: 1, totalPages: 0 });

    var startDate = this.startDate != "" ? new Date(this.startDate).toISOString().split('T')[0] : "";
    var endDate = this.endDate != "" ? new Date(this.endDate).toISOString().split('T')[0] : "";
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    this.paymentService.getAllPayments(this.pageInfo().currentPage, startDate, endDate).pipe(
      map(response => response)
    ).subscribe(response => {
      this.payments.set(response.payments);
      this.pageInfo.set(response.pageInfo);
    });
  }
}
