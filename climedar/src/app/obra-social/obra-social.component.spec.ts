import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObraSocialComponent } from './obra-social.component';

describe('ObraSocialComponent', () => {
  let component: ObraSocialComponent;
  let fixture: ComponentFixture<ObraSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObraSocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObraSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
