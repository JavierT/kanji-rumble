import {NgModule} from '@angular/core';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTabsModule,
    MatBottomSheetModule
  } from '@angular/material';

@NgModule({
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule, 
        MatInputModule,
        MatSnackBarModule,
        MatGridListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatDialogModule,
        MatPaginatorModule,
        MatTabsModule,
        MatBottomSheetModule
      ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule, 
        MatInputModule,
        MatSnackBarModule,
        MatGridListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatDialogModule,
        MatPaginatorModule,
        MatTabsModule,
        MatBottomSheetModule
      ]
})
export class MaterialModule {}