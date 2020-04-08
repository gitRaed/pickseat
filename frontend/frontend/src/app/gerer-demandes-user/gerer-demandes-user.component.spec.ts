import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GererDemandesUserComponent } from './gerer-demandes-user.component';

describe('GererDemandesUserComponent', () => {
  let component: GererDemandesUserComponent;
  let fixture: ComponentFixture<GererDemandesUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GererDemandesUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GererDemandesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
