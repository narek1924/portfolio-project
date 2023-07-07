import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSevenDaysComponent } from './next-seven-days.component';

describe('NextSevenDaysComponent', () => {
  let component: NextSevenDaysComponent;
  let fixture: ComponentFixture<NextSevenDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextSevenDaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextSevenDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
