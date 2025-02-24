import { AuthService } from './../service/auth.service';
import { Component } from '@angular/core';
import { CenteredCardComponent } from '../../shared/components';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [
    CenteredCardComponent,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService: AuthService) { 
    const queryParams = new URLSearchParams(window.location.hash.substring(1));
    const urlParams = new URLSearchParams(queryParams);
    if (urlParams.has('access_token')) {
      this.authService.handleAuthentication();
    }
  }

  formgroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('')
  });

  public login(): void {
    console.log("Login");
    this.authService.login(this.formgroup.controls['email'].value, this.formgroup.controls['password'].value);
  }

}
