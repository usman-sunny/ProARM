import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsBaseNavComponent } from './analytics-base-nav.component';

describe('AnalyticsBaseNavComponent', () => {
  let component: AnalyticsBaseNavComponent;
  let fixture: ComponentFixture<AnalyticsBaseNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsBaseNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsBaseNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
