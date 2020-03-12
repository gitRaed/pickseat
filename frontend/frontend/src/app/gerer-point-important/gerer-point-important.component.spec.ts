import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GererPointImportantComponent } from './gerer-point-important.component';

describe('GererPointImportantComponent', () => {
  let component: GererPointImportantComponent;
  let fixture: ComponentFixture<GererPointImportantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GererPointImportantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GererPointImportantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
