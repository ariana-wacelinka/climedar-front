import { Component, Inject, LOCALE_ID, signal } from '@angular/core';
import { ConsultationResponse } from '../models/consultation.model';
import { PaymentDialogComponent } from '../../shared/components/payment-dialog/payment-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../shared/services/payment/payment.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import { CommonModule } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { ConsultationService } from '../services/consultation.service';
import { Router } from '@angular/router';

registerLocaleData(localeEsAr, 'es-AR');

@Component({
  selector: 'app-consultation-info',
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './consultation-info.component.html',
  styleUrl: './consultation-info.component.scss',
  providers: [provideNativeDateAdapter(),
  { provide: LOCALE_ID, useValue: 'es-AR' },]
})
export class ConsultationInfoComponent {
  consultation = signal<ConsultationResponse>({} as ConsultationResponse);

  constructor(
    private dialog: MatDialog,
    private paymentService: PaymentService,
    public dialogRef: MatDialogRef<ConsultationInfoComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {
      consultation: ConsultationResponse,
    },
  ) {
    this.consultation.set(data.consultation);
  }

  pagarConsultation() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: { price: this.consultation().finalPrice }
    });
    dialogRef.componentInstance.paymentConfirmed.subscribe((method: string) => {
      console.log('method', method);
      this.paymentService.createPayment(method, this.consultation().id!).subscribe(
        (blob) => {
          console.log('blob', blob);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const nombrePaciente = this.consultation().patient?.name + "-" + this.consultation().patient?.surname;
          a.download = `factura - ${this.consultation().id} -${nombrePaciente}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.log('error', error);
        }
      );
    });
  }

  modificarConsulta() {
    this.dialogRef.close();
    this.router.navigate(['/consulta/editar'],
      { state: { consultaData: this.consultation() } }
    );
  }
}
