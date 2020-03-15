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
    MatProgressSpinnerModule 
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
        MatProgressSpinnerModule
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
        MatProgressSpinnerModule
      ]
})
export class MaterialModule {}