import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDayContentComponent } from './my-day-content.component';

describe('MyDayContentComponent', () => {
  let component: MyDayContentComponent;
  let fixture: ComponentFixture<MyDayContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyDayContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDayContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
