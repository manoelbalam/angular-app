import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogsService, Post } from '../dogs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dogs-list',
  imports: [ CommonModule ],
  template: `
    <p>
      dogs-list works!
    </p>
    <hr>
    <div *ngIf="(posts$ | async) as posts">
      <ul>
        <li *ngFor="let post of posts ">
          {{ post.title }}
        </li>
      </ul>
    </div>
    <hr>

  `,
  styles: ``
})
export class DogsListComponent implements OnInit {

  posts$!: Observable<any>;

  constructor(readonly dogsService: DogsService) { }

  ngOnInit() {
    this.posts$ = this.dogsService.getPosts();
  }
  

}
