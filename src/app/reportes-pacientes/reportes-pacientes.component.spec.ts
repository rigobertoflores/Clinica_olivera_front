import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPacientesComponent } from './reportes-pacientes.component';

describe('ReportesPacientesComponent', () => {
  let component: ReportesPacientesComponent;
  let fixture: ComponentFixture<ReportesPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
