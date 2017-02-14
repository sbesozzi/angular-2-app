import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Article } from '../article';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements
OnInit {
  private articles: Article[];

  constructor(
    private articleService: ArticleService
  ) { }

  // Heavy lifting done in OnInit callback
  ngOnInit() {
    this.articleService
      .getArticles()
      .then(articles => this.articles = articles);
  }
}
