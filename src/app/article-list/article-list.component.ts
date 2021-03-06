import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { Article } from '../article';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})

// Implements ngOnInit()
export class ArticleListComponent implements OnInit {
  private articles: Observable<Article[]>;

  constructor(
    private articleService: ArticleService,
    private activeRoute: ActivatedRoute
  ) {
    this.articles =
    articleService.orderedArticles;
  }

  // Life cycle hook
  // Heavy lifting done in ngnInit callback
  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      const sourceKey = params['sourceKey'];
      this.articleService.updateArticles(sourceKey);
    })
  }
}
