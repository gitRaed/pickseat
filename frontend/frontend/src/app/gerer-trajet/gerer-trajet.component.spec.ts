import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GererTrajetComponent } from './gerer-trajet.component';

describe('GererTrajetComponent', () => {
  let component: GererTrajetComponent;
  let fixture: ComponentFixture<GererTrajetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GererTrajetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GererTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
