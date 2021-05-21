import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest, AccountInfo } from '@azure/msal-browser';
import { AuthenticationResult } from '@azure/msal-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MSAL Authentication Example';
  apiResponse: string;

  constructor(private _authService: MsalService,
    private http: HttpClient) {

  }
  ngOnInit(): void {
    this._authService.instance.handleRedirectPromise().then(res => {
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
    // this._authService.loginRedirect();

    // popup login
    this._authService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this._authService.instance.setActiveAccount(response.account);
      });
  }

  logout() {
    this._authService.logout()
  }

  callProfile() {
    this.http.get("https://graph.microsoft.com/v1.0/me").subscribe(resp => {
      this.apiResponse = JSON.stringify(resp)
    })
  }

  callEmails() {
    this.http.get("https://graph.microsoft.com/v1.0/me/messages").subscribe(resp => {
      this.apiResponse = JSON.stringify(resp)
    })
  }

  callBackReq() {

  }

  sayHello() {

    console.log('testing')

    // this._authService.acquireTokenSilent
    // this.reqTest({
    //   scopes: ['api://f4bea837-2e83-41aa-990d-2d7c33edf360/user_impersonation']
    // });

    this._authService.acquireTokenSilent({
      scopes: ['api://68c114b2-c995-40f3-9ae7-9daf4a55a7a7/user_impersonation']
    }).subscribe(test => {
      console.log('test', test)

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${test.idToken}`
      });

      this.http.get("https://azfunctestauth.azurewebsites.net/api/hello-world?name=fred", { responseType: 'text', headers }).subscribe(resp => {
        console.log('fred', resp)
        // this.apiResponse = resp
      })
    })


    const headers = {
      responseType: 'text'
    }

    // this.http.get("https://azfunctestauth.azurewebsites.net/api/hello-world?name=fred", { responseType: 'text' }).subscribe(resp => {
    //   console.log('fred', resp)
    //   // this.apiResponse = resp
    // })
  }

  reqTest(request: SilentRequest) {

    this.http.get("https://graph.microsoft.com/v1.0/me").subscribe(brah => {



      let test: AccountInfo = {
        homeAccountId: brah['id'],
        environment: '',
        tenantId: '',
        username: brah['userPrincipalName'],
        localAccountId: brah['id'],
      }
      console.log('test', test)
      request.account = test; //this.http.get("https://graph.microsoft.com/v1.0/me").toPromise();
      this._authService.acquireTokenSilent(request).subscribe(resp => {
        //this.callMyFunction(resp.accessToken)
        console.log(resp)
      }, (error) => {
        console.error('broh', error)
      })
    })
  }

  callMyFunction(accessToken) {

    // Callback code here
    console.log("Access token: " + accessToken);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      console.log('here')
      //  if (this.readyState == 4 && this.status == 200)
      //     myFunctionCallback(this.responseText);
    }

    // My function endpoint. Change to match yours!
    xmlHttp.open("GET", "https://anotherv.azurewebsites.net/api/Apikutsu?name=world", true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.send();
  }



}
