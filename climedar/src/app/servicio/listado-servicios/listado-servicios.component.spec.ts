import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoServiciosComponent } from './listado-servicios.component';

describe('ListadoServiciosComponent', () => {
  let component: ListadoServiciosComponent;
  let fixture: ComponentFixture<ListadoServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
