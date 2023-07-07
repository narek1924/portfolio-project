import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstVisitComponent } from './first-visit.component';

describe('FirstVisitComponent', () => {
  let component: FirstVisitComponent;
  let fixture: ComponentFixture<FirstVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
