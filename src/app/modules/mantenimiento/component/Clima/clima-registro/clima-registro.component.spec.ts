import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaRegisterComponent } from './clima-registro.component';

describe('ClimaRegisterComponent', () => {
  let component: ClimaRegisterComponent;
  let fixture: ComponentFixture<ClimaRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClimaRegisterComponent]
    });
    fixture = TestBed.createComponent(ClimaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse', () => {
    expect(component).toBeTruthy();
  });
});
