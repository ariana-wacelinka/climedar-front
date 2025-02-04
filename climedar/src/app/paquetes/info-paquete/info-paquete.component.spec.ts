import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPaqueteComponent } from './info-paquete.component';

describe('InfoPaqueteComponent', () => {
  let component: InfoPaqueteComponent;
  let fixture: ComponentFixture<InfoPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPaqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
