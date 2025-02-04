import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPaquetesComponent } from './listado-paquetes.component';

describe('ListadoPaquetesComponent', () => {
  let component: ListadoPaquetesComponent;
  let fixture: ComponentFixture<ListadoPaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPaquetesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
