import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { DataService } from 'app/services/data.service';
import { Irecord } from 'app/models/records.model.';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', './../auth.style.scss']
})
export class RegisterComponent implements OnInit {

  error: string = null;

  constructor(private authService: AuthService, private dataService: DataService,
    private router: Router, private route: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {

    this.authService.registerWithEmail(form.value.email, form.value.password, form.value.username)
      .catch((error) => {
        console.log(error)
        form.value.password = '';
        this._snackBar.open(error, 'Ok', {
          duration: 3000
        });
      });
  }

  tryGoogleAuth() {
    this.authService.registerWithGoogleAuth()
      .then((res) => {})
      .catch((error) => {
        console.log(error)
        this._snackBar.open(error, 'Ok', {
          duration: 3000
        });
      }
      );
  }
}
