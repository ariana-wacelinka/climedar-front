import { Component } from '@angular/core';
import { ToolbarComponent } from '../index';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-centered-card',
  imports: [ToolbarComponent, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './centered-card.component.html',
  styleUrl: './centered-card.component.scss'
})
export class CenteredCardComponent {

}
