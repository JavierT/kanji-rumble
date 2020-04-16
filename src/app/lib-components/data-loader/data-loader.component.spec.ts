import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLoaderComponent } from './data-loader.component';

describe('DataLoaderComponent', () => {
  let component: DataLoaderComponent;
  let fixture: ComponentFixture<DataLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
