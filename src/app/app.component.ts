import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MSAL Authentication Example';

  constructor(private _authService: MsalService) {

  }
  ngOnInit(): void {
    this._authService.instance.handleRedirectPromise().then( res => {
      if (res != null && res.account != null) {
        this._authService.instance.setActiveAccount(res.account)
      }
    })
  }

  isLoggedIn(): boolean {
    return this._authService.instance.getActiveAccount() != null
  }

  login() {
    // redirect login 
    this._authService.loginRedirect();

    // popup login
    // this._authService.loginPopup()
    //   .subscribe((response: AuthenticationResult) => {
    //     this._authService.instance.setActiveAccount(response.account);
    //   });
  }

  logout() {
    this._authService.logout()
  }
}
