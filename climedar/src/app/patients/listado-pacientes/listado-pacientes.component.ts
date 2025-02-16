import { Component, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Paciente } from '../models/paciente.models';
import { PageInfo } from '../../shared/models/extras.models';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-pacientes',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    CenteredCardComponent,
    MatTableModule,
    PaginatorComponent,
    MatButtonModule,
    MatLabel,
    MatInputModule
  ],
  templateUrl: './listado-pacientes.component.html',
  styleUrl: './listado-pacientes.component.scss'
})
export class ListadoPacientesComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  displayedColumns: string[] = ["name", "surname", "dni", "edit"];
  dataSource = new MatTableDataSource<Paciente>();
  pacientes = signal<Paciente[]>([]);

  constructor(public router: Router) {}

  createPaciente() {
    this.router.navigate(['/paciente/nuevo']);
  }

  editPaciente(paciente: Paciente) {
    console.log('Editar usuario', paciente);
  }

  deletePaciente(id: number) {
    console.log('Eliminar usuario', id);
  }

  pacienteInfo(paciente: Paciente) {
    console.log('Información de usuario', paciente);
  }

  currentPage(): WritableSignal<number> {
      return signal<number>(this.pageInfo().currentPage + 1);
    }
  
  pageChange(page: number) {
    this.pageInfo.set({ ...this.pageInfo(), currentPage: page });

    // this.packageService.getAllPackages(page).subscribe(response => {
    //   this.packages.set(response.packages);
    //   this.pageInfo.set(response.pageInfo);
    //   this.dataSource.data = this.packages()
    // });
  }
}
