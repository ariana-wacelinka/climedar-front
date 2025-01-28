import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosObraSocialComponent } from './datos-obra-social.component';

describe('DatosObraSocialComponent', () => {
  let component: DatosObraSocialComponent;
  let fixture: ComponentFixture<DatosObraSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosObraSocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
