import { Component } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatTabsModule } from '@angular/material/tabs';
import { EstadisticasComponent } from "./estadisticas/estadisticas.component";
import { PagosComponent } from "./pagos/pagos.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-facturacion',
  imports: [
    CenteredCardComponent,
    MatTabsModule,
    EstadisticasComponent,
    PagosComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss'
})
export class FacturacionComponent {
  volver() {
    window.history.back();
  }
}
