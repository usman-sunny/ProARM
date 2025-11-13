import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTopNavComponent } from './analytics-top-nav.component';

describe('AnalyticsTopNavComponent', () => {
  let component: AnalyticsTopNavComponent;
  let fixture: ComponentFixture<AnalyticsTopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsTopNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
