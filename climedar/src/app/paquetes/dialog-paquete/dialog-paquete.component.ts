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
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { MatCardModule } from '@angular/material/card';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { PageInfo } from '../../shared/models/extras.models';
import { MedicalService } from '../../servicio/models/services.models';
import { ServiciosMedicosService } from '../../servicio/services/servicio/servicios-medicos.service';
import { Duration } from 'luxon';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { PackageService } from '../services/package.service';
import { Package, PackageRequest } from '../models/package.models';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatOption } from '@angular/material/autocomplete';
import { debounceTime, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { Especialidad, EspecialidadService } from '../../especialidad';

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
    MatTabsModule,
    MatAutocompleteModule,
    MatOption,
    MatError,
    AsyncPipe
  ],
  styleUrls: ['./dialog-paquete.component.scss']
})
export class DialogPaqueteComponent {
  servicios = signal<MedicalService[]>([]);
  totalAmount = signal<number>(0);
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 });
  displayedColumns: string[] = ["select", "name", "precio"];
  servicioControl = new FormControl<string>("");
  filteredEspecialidadOptions: Observable<Especialidad[]> | undefined;

  especialidadId = signal<string>('');
  filterValue = signal<string>('');

  paquete = new FormGroup({
    id: new FormControl<string>(""),
    name: new FormControl<string>("", Validators.required),
    servicesIds: new FormControl<string[]>([]),
    specialityId: new FormControl<string>("", Validators.required)
  })

  especialidad = new FormControl<Especialidad | null>(null);

  constructor(public dialogRef: MatDialogRef<DialogPaqueteComponent>,
    private packageService: PackageService,
    private medicalService: ServiciosMedicosService,
    private especialidadService: EspecialidadService,
    @Inject(MAT_DIALOG_DATA) public data: {
      id?: number,
      name?: string,
      servicesIds?: string[]
      specialityId?: string
    }) {
    if (data.id) {
      this.paquete.controls.id.patchValue(data.id?.toString());
      this.paquete.controls.name.patchValue(data.name!);
      this.paquete.controls.servicesIds.patchValue(data.servicesIds!);
      this.paquete.controls.specialityId.patchValue(data.specialityId!);
    }
  }

  ngOnInit() {
    this.getServices();

    this.filteredEspecialidadOptions = this.paquete.controls.specialityId.valueChanges.pipe(
      startWith(''),
      filter((value): value is string => typeof value === 'string'),
      debounceTime(300),
      switchMap(value => {
        const title = value;
        return this.especialidadService.getEspecialidadesByNombre(title).pipe(
          map((especiliades: Especialidad[]) => {
            return especiliades;
          })
        );
      }),
    );
  }

  displayEspecialidad(especialidad: Especialidad): string {
    return especialidad ? especialidad.name! : '';
  }

  selectedEspeciality(event: MatAutocompleteSelectedEvent) {
    this.paquete.controls.specialityId.setValue(event.option.value.id);
    this.especialidadId.set(this.paquete.controls.specialityId.value!);
    this.loadEspecialidades();    
  }

  loadEspecialidades() {
    this.medicalService.getAllServiciosMedicosFiltro(this.pageInfo().currentPage, this.especialidadId(), this.filterValue().trim().toLowerCase()).subscribe((data) => {
      console.log(data);
      this.servicios.set(data.services);
      this.pageInfo.set(data.pageInfo);
    });
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
    return signal<number>(this.pageInfo().currentPage);
  }

  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    this.medicalService.getAllServiciosMedicosFiltro(page, this.especialidadId(), this.filterValue().trim().toLowerCase()).subscribe((response) => {
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

  applyFilterService(event: Event) {
    this.filterValue.set((event.target as HTMLInputElement).value);
    this.loadEspecialidades();
  }

  onSubmit() {
    if (this.data.id == null) {
      if (this.paquete.valid) {
        const paquete: PackageRequest = {
          name: this.paquete.value.name!,
          servicesIds: this.paquete.value.servicesIds!,
          specialityId: this.paquete.value.specialityId!
        };
        console.log(paquete);

        this.packageService.createPackage(paquete).subscribe((response) => {
          console.log('Paquete creado' + response);
          this.onClose();
        });
      }
    } else {
      if (this.paquete.valid) {
        const paquete: PackageRequest = {
          id: this.paquete.value.id!,
          name: this.paquete.value.name!,
          servicesIds: this.paquete.value.servicesIds!,
          specialityId: this.paquete.value.specialityId!
        };

        this.packageService.updatePackage(paquete).subscribe((response) => {
          alert('Paquete editado: ' + response);
          this.onClose();
          window.location.reload();
        });
      }
    }
  }
  
  onClose() {
    this.dialogRef.close();
  }
}
