import { Component, signal, WritableSignal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { FormControl, FormsModule, Validators } from '@angular/forms';
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
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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
    private paymentService: PaymentService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.loadPayments(1);
  }

  loadPayments(page: number) {
    this.paymentService.loadPayments(page).pipe(
      map(response => response)
    ).subscribe(response => {
      this.payments.set(response.payments);
      console.log('Respuesta de pagos', response.payments);
      this.pageInfo.set(response.pageInfo);
    });
  }

  paymentsFilteredPerDay(page: number) {
    var fromDate = this.startDate != "" ? new Date(this.startDate).toISOString().split('T')[0] : "";
    var toDate = this.endDate != "" ? new Date(this.endDate).toISOString().split('T')[0] : "";

    this.paymentService.getAllPayments(page, fromDate, toDate).pipe(
      map(response => response)
    ).subscribe(response => {
      this.payments.set(response.payments);
      console.log('Respuesta de pagos', response.payments);
      this.pageInfo.set(response.pageInfo);
    });
  }

  cancelarPago(pago: Payment) {
    this.paymentService.cancelPayment(pago).subscribe(() => {
      this.loadPayments(this.pageInfo().currentPage);
    });
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });
    this.loadPayments(page);
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

    this.loadPayments(this.pageInfo().currentPage);
  }

  descargarFactura(pago: Payment) {
    console.log('pago', pago);
    this.paymentService.getInvoiceByPayment(pago.id).subscribe(
      (blob) => {
        console.log('blob', blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nombrePaciente = pago.consultation.patient.name + "-" + pago.consultation.patient.surname;
        a.download = `factura-${pago.id}-${nombrePaciente}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.log('error', error);
        this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al descargar la factura' } });
      }
    );
  }

  descargarRecibo(pago: Payment) {
    console.log('pago', pago);
    this.paymentService.getReceiptByPayment(pago.id).subscribe(
      (blob) => {
        console.log('blob', blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nombrePaciente = pago.consultation.patient.name + "-" + pago.consultation.patient.surname;
        a.download = `recibo-${pago.id}-${nombrePaciente}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.log('error', error);
        this.dialog.open(ErrorDialogComponent, { data: { message: 'Error al descargar la factura' } });
      }
    );
  }
}
