import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
    <main class="main">
      <div class="flex flex-col justify-center items-center p-16">
          <h1 class="text-3xl underline text-amber-700 mt-10 hover:bg-fuchsia-600">Welcome to {{title}} with TailwindCss</h1>
      </div>
    </main>
  `,
  styles: [],
})
export class AppComponent {
  title = 'angular-app';
}
