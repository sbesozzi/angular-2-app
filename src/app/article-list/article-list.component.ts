import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Article } from '../article';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})

// Implements ngOnInit()
export class ArticleListComponent implements
OnInit {
  private articles: Article[];

  constructor(
    private articleService: ArticleService
  ) { }

  // Life cycle hook
  // Heavy lifting done in ngnInit callback
  ngOnInit() {
    this.articleService
      .getArticles()
      .then(articles => this.articles = articles);
  }
}
