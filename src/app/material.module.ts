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
    MatTabsModule
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
        MatTabsModule
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
        MatTabsModule
      ]
})
export class MaterialModule {}