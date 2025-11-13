import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsWorkspaceComponent } from './analytics-workspace.component';

describe('AnalyticsWorkspaceComponent', () => {
  let component: AnalyticsWorkspaceComponent;
  let fixture: ComponentFixture<AnalyticsWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
