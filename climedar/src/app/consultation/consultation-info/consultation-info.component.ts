import { Component, Inject, signal } from '@angular/core';
import { ConsultationResponse } from '../models/consultation.model';
import { PaymentDialogComponent } from '../../shared/components/payment-dialog/payment-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../shared/services/payment/payment.service';
import { ConsultationService } from '../services/consultation.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-consultation-info',
  imports: [
    MatIconModule
  ],
  templateUrl: './consultation-info.component.html',
  styleUrl: './consultation-info.component.scss'
})
export class ConsultationInfoComponent {
  consultation = signal<ConsultationResponse | null>(null);

  constructor(
    private dialog: MatDialog,
    private paymentService: PaymentService,
    private consultationService: ConsultationService,
    public dialogRef: MatDialogRef<ConsultationInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      consultation: ConsultationResponse,
    },
  ) {
    this.consultation.set(data.consultation);
  }

  pagarConsultation(consultation: ConsultationResponse) {
    console.log('consultation', consultation);
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: { price: consultation.finalPrice }
    });
    dialogRef.componentInstance.paymentConfirmed.subscribe((method: string) => {
      console.log('method', method);
      this.paymentService.createPayment(method, consultation.id!).subscribe(
        (blob) => {
          console.log('blob', blob);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const nombrePaciente = consultation.patient?.name + "-" + consultation.patient?.surname;
          a.download = `factura - ${consultation.id} -${nombrePaciente}.pdf`;
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
}
