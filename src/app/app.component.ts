import { Component } from '@angular/core';
import { Article } from './article';

// Parent
// Pass in each article into app-article
@Component({
  selector: 'app-root',
  template: './app.component.html'
})
export class AppComponent {
  // Article model
  articles: Article[];

  // Constructor function new instances of Article
  // List of articles
  // Pass into ArticleComponent
  constructor() {
    this.articles = [
      new Article(
        'The Angular 2 screencast',
        'The easiest way to learn Angular 2'
      ) ,
      new Article(
        'Fullstack React',
        'Want to learn React? No!'
      ),
      new Article(
        'Vue is new',
        'And pretty cool.'
      )

    ];
  }

}
