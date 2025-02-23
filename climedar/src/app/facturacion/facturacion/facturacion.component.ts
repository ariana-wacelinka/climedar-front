import { Component } from '@angular/core';
import { CenteredCardComponent } from "../../shared/components/centered-card/centered-card.component";
import { MatTabsModule } from '@angular/material/tabs';
import { EstadisticasComponent } from "./estadisticas/estadisticas.component";
import { PagosComponent } from "./pagos/pagos.component";

@Component({
  selector: 'app-facturacion',
  imports: [CenteredCardComponent, MatTabsModule, EstadisticasComponent, PagosComponent],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss'
})
export class FacturacionComponent {

}
