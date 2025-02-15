import { Component, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Paciente } from '../models/paciente.models';
import { PageInfo } from '../../shared/models/extras.models';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-listado-pacientes',
  imports: [MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    CenteredCardComponent,
    MatTableModule,
    PaginatorComponent
  ],
  templateUrl: './listado-pacientes.component.html',
  styleUrl: './listado-pacientes.component.scss'
})
export class ListadoPacientesComponent {
  pageInfo = signal<PageInfo>({ totalItems: 0, currentPage: 1, totalPages: 0 })
  displayedColumns: string[] = ["name", "surname", "dni", "edit"];
  dataSource = new MatTableDataSource<Paciente>();
  users = signal<Paciente[]>([]);

  constructor() {}

  createUser() {
    console.log('Crear usuario');
  }

  editUser(paciente: Paciente) {
    console.log('Editar usuario', paciente);
  }

  deleteUser(paciente: Paciente) {
    console.log('Eliminar usuario', paciente);
  }

  userInfo(paciente: Paciente) {
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
