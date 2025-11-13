import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsRightPopupComponent } from './analytics-right-popup.component';

describe('AnalyticsRightPopupComponent', () => {
  let component: AnalyticsRightPopupComponent;
  let fixture: ComponentFixture<AnalyticsRightPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsRightPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsRightPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
