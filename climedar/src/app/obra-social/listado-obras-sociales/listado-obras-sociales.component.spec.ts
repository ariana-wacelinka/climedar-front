import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoObrasSocialesComponent } from './listado-obras-sociales.component';

describe('ObraSocialComponent', () => {
  let component: ListadoObrasSocialesComponent;
  let fixture: ComponentFixture<ListadoObrasSocialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoObrasSocialesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoObrasSocialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
