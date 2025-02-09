import { Component, OnInit, signal } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-consultation',
  imports: [
    CenteredCardComponent
  ],
  templateUrl: './create-consultation.component.html',
  styleUrl: './create-consultation.component.scss'
})
export class CreateConsultationComponent implements OnInit {

  turnoId = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('turnoId');
      this.turnoId.set(id);

      // Elimina el ID de la URL después de obtenerlo
      if (id) {
        this.router.navigate(['/consultation/create'], { replaceUrl: true });
      }
    });
  }

  ngOnInit(): void {

  }

  isFromShift(): boolean {
    return !!this.turnoId();
  }

  
}
