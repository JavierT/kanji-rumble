import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string = null;

  constructor(private authService: AuthService, 
    private router: Router, private route: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authService.autoLogin(this.route);
  }

  onSubmit(form: NgForm) {
    console.log('doing logging with ', form)
    this.authService.login(form.value.email, form.value.password).then(
      res => {
        console.log(res)
        form.reset();
        this.router.navigate(['modify'], {relativeTo: this.route} );
      }).catch(
      errorMessage => {
        console.log(errorMessage)
        form.value.password = '';
        this._snackBar.open(errorMessage.msg, 'Ok', {
          duration: 3000});
      }
    )

  }

}
