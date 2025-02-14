import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { MatCardModule } from '@angular/material/card';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { PageInfo } from '../../shared/models/extras.models';
import { MedicalService } from '../../servicio/models/services.models';
import { ServiciosMedicosService } from '../../servicio/services/servicio/servicios-medicos.service';
import { Duration } from 'luxon';
import { CurrencyPipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { PackageService } from '../services/package.service';

@Component({
  selector: 'app-dialog-paquete',
  templateUrl: './dialog-paquete.component.html',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    PaginatorComponent,
    MatCardModule,
    MatSelectionList,
    MatListModule,
    CurrencyPipe,
    MatTabsModule
  ],
  styleUrls: ['./dialog-paquete.component.scss']
})
export class DialogPaqueteComponent {
  servicios = signal<MedicalService[]>([]);
  totalAmount = signal<number>(0);
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });
  displayedColumns: string[] = ["select", "nombre", "precio"];
  servicioControl = new FormControl<string>("");

  paquete = new FormGroup({
    id: new FormControl<string>(""),
    nombre: new FormControl<string>("", Validators.required),
    servicesIds: new FormControl<string[]>([])
  })

  constructor(public dialogRef: MatDialogRef<DialogPaqueteComponent>,
    private packageService: PackageService,
    private medicalService: ServiciosMedicosService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id?: number,
      nombre?: string,
      servicesIds?: MedicalService[]
    }) {
    if (data.id) {
      this.paquete.controls.id.setValue(data.id?.toString());
      this.paquete.controls.nombre.setValue(data.nombre!);
      this.paquete.controls.servicesIds.setValue(data.servicesIds!.map(service => service.id!));
    }
  }

  ngOnInit() {
    this.getServices();
  }

  getServices(): void {
    this.medicalService.getAllServiciosMedicos(this.pageInfo().currentPage).subscribe((data) => {
      this.servicios.set(data.services);
      this.pageInfo.set(data.pageInfo);
    });
  }

  formatDurationTime(duration: string): string {
    return Duration.fromISO(duration).as('minutes') + ' min';
  }

  currentPage(): WritableSignal<number> {
    return signal<number>(this.pageInfo().currentPage + 1);
  }

  pageChange(page: number) {
    this.medicalService.getServiciosMedicos(this.servicioControl.value ?? "", "", page).subscribe((response) => {
      this.servicios.set(response.services);
      this.pageInfo.set(response.pageInfo);
    });
  }

  selectionChange(event: boolean, id: string) {
    const selectedServices = this.paquete.controls.servicesIds.value || [];

    if (event) {
      this.paquete.controls.servicesIds.setValue([...selectedServices, id]);
    } else {
      this.paquete.controls.servicesIds.setValue(selectedServices.filter(serviceId => serviceId !== id));
    }

    const servicio = this.servicios().find(servicio => servicio.id === id);
    if (servicio) {
      this.totalAmount.set(event ? this.totalAmount() + Number(servicio.price) : this.totalAmount() - Number(servicio.price));
    }
  }

  isServicioSelected(id: string): boolean {
    return this.paquete.controls.servicesIds.value!.includes(id);
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.data.id == null) {
      if (this.paquete.valid) {
        const paquete = {
          name: this.paquete.value.nombre!,
          servicesIds: this.paquete.value.servicesIds!
        };

        console.log(paquete);
        this.packageService.createPackage(paquete).subscribe((response) => {
          alert('Paquete creado' + response);
          this.onClose();
        });
      }
    } else {
      if (this.paquete.valid) {
        const paquete = {
          id: this.paquete.value.id,
          nombre: this.paquete.value.nombre,
          servicesIds: this.paquete.value.servicesIds
        };

        console.log(paquete);
        alert('Paquete editado: ' + this.paquete.value);
        this.onClose();
      }
    }
  }
}
