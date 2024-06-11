import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimaListaComponent } from './clima-lista.component';

describe('ClimaListaComponent', () => {
  let component: ClimaListaComponent;
  let fixture: ComponentFixture<ClimaListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClimaListaComponent]
    });
    fixture = TestBed.createComponent(ClimaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse', () => {
    expect(component).toBeTruthy();
  });
});
