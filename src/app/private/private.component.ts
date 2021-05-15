import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

  constructor(private _msalService: MsalService) { }

  ngOnInit(): void {
  }

  getUsername(): string {
    return this._msalService.instance.getActiveAccount().name;
  }

}
