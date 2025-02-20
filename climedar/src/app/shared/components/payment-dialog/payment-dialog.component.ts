import { NgFor, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { PaymentMethods } from '../../models/extras.models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-payment-dialog',
  imports: [NgFor, FormsModule, MatButtonModule, MatSelectModule, MatDialogModule, CurrencyPipe],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent {

  @Input() price!: number;
  @Output() paymentConfirmed = new EventEmitter<string>();

  selectedPayment: string | null = null;
  paymentMethods = Object.values(PaymentMethods);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { price: number }) {
    this.price = data.price;
  }

  private dialogRef = inject(MatDialogRef<PaymentDialogComponent>);

  confirmPayment() {
    const paymentMethodKey = Object.keys(PaymentMethods).find(key => PaymentMethods[key as keyof typeof PaymentMethods] === this.selectedPayment);
    this.paymentConfirmed.emit(paymentMethodKey);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
