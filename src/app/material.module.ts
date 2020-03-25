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
    MatTableModule
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
        MatTableModule
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
        MatTableModule
      ]
})
export class MaterialModule {}