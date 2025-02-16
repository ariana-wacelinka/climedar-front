import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { PaymentMethods } from '../../models/extras.models';

@Component({
  selector: 'app-payment-dialog',
  imports: [NgIf, NgFor, FormsModule, MatButtonModule, MatSelectModule, MatDialogModule, CurrencyPipe],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent {

  @Input() price!: number;
  @Output() paymentConfirmed = new EventEmitter<string>();

  selectedPayment: string | null = null;
  paymentMethods = Object.values(PaymentMethods);

  private dialogRef = inject(MatDialogRef<PaymentDialogComponent>);

  confirmPayment() {
    this.paymentConfirmed.emit(this.selectedPayment!);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
