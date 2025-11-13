import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsReportModalComponent } from './analytics-report-modal.component';

describe('AnalyticsReportModalComponent', () => {
  let component: AnalyticsReportModalComponent;
  let fixture: ComponentFixture<AnalyticsReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsReportModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal when onClose is called', () => {
    spyOn(component.closeModal, 'emit');
    component.onClose();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should emit saveReport when onSave is called', () => {
    spyOn(component.saveReport, 'emit');
    component.onSave();
    expect(component.saveReport.emit).toHaveBeenCalledWith(component.reportData);
  });

  it('should add field when addField is called', () => {
    const initialLength = component.reportData.fields.length;
    component.addField();
    expect(component.reportData.fields.length).toBe(initialLength + 1);
  });

  it('should remove field when removeField is called', () => {
    component.addField();
    component.addField();
    const initialLength = component.reportData.fields.length;
    component.removeField(0);
    expect(component.reportData.fields.length).toBe(initialLength - 1);
  });

  it('should set report type from input', () => {
    component.reportType = 'chart';
    component.ngOnInit();
    expect(component.reportData.type).toBe('chart');
  });
});
