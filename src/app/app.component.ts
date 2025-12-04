import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DogsListComponent } from "./components/dogs-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DogsListComponent],
  template: `
    <router-outlet />
    <app-dogs-list></app-dogs-list>
  `,
  styles: [],
})
export class AppComponent {
  title = 'angular-app';
}
