import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthorizationService } from "../../authorization/authorization.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SignIn } from "./sign-in";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { CustomResponse } from "../../common/custom-response";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
  public static ROUTE = 'sign-in';
  public static NAVIGATE = '/sign-in';

  private subscriptions: Subscription[] = [];
  public loading: boolean = false;
  public submitted: boolean = false;
  public hide_password = true;

  public signInFormControl: FormGroup;

  constructor(private authorizationService: AuthorizationService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.signInFormControl = this.formBuilder.group({
      login_name: ['', Validators.required],
      login_password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  public onSubmit(signIn: SignIn): void {
    this.submitted = true;

    if (this.signInFormControl.invalid) {
      return;
    }

    signIn.signInFrom = 'Web';
    this.loading = true;

    this.subscriptions.push(
      this.authorizationService.doSignIn(signIn).subscribe({
        next: (response: HttpResponse<any>) => {
          const token = response.headers.get(AuthorizationService.HEADER_TOKEN_KEY);
          this.authorizationService.saveToken(token);
          const role = this.authorizationService.getUserRole();
          this.redirectUserBasedOnRole(role);
          this.loading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          let errorObject: CustomResponse = errorResponse.error;
          this.showErrorMessage(errorObject.message);
          this.loading = false;
        }
      })
    );
  }

  private redirectUserBasedOnRole(role: string | null): void {
    if (role === 'super_admin') {
      this.router.navigate(['/list-user']).then(() => {});
    } else if (role === 'helper') {
      this.router.navigate(['/list-helper-room']).then(() => {});
    } else {
      this.router.navigate(['/list-user']).then(() => {});
    }
  }

  private showErrorMessage(message: string): void {
    alert(message);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
