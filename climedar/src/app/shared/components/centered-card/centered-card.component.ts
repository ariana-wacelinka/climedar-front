import { Component } from '@angular/core';
import { ToolbarComponent } from '../index';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-centered-card',
  imports: [ToolbarComponent, MatCardModule],
  templateUrl: './centered-card.component.html',
  styleUrl: './centered-card.component.scss'
})
export class CenteredCardComponent {

}
