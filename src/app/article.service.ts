import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Article } from './article';
import { environment } from '../environments/environment';

interface ArticleSortFn {
  (a: Article, b: Article): number;
}

interface ArticleSortOrderFn {
  (direction: number): ArticleSortFn;
}

const sortByTime: ArticleSortOrderFn =
  (direction: number) => (a: Article, b: Article) => {
    return direction *
    (b.publishedAt.getTime() -
    a.publishedAt.getTime());
  };

const sortByVotes: ArticleSortOrderFn =
  (direction: number) => (a: Article, b: Article) => {
    return direction * (b.votes - a.votes);
  };

const sortFns = {
  'Time': sortByTime,
  'Votes': sortByVotes
};

@Injectable()
export class ArticleService {
  // Initial value empty array
  private _articles: BehaviorSubject<Article[]> =
    new BehaviorSubject<Article[]>([]);

  private _sortByDirectionSubject:
  BehaviorSubject<number> = new
  BehaviorSubject<number>(1);
  private _sortByFilterSubject:
  BehaviorSubject<ArticleSortOrderFn> = new
  BehaviorSubject<ArticleSortOrderFn>(sortByTime);

  private _filterBySubject:
  BehaviorSubject<string> = new
  BehaviorSubject<string>('');

  // Instance value of articles acts as Observable
  public articles: Observable<Article[]> = this._articles.asObservable();
  public orderedArticles: Observable<Article[]>;

  // Local instance of http service
  constructor(
    private http: Http
  ) {
    this.orderedArticles =
      Observable.combineLatest(
        this._articles,
        this._sortByFilterSubject,
        this._sortByDirectionSubject,
        this._filterBySubject
      ).map(([
        article, sorter, direction, filterStr
      ]) => {
        const re = new RegExp(filterStr, 'gi');
        return article
          .filter(a => re.exec(a.title))
          .sort(sorter(direction));
      })
  }

  public sortBy(
    filter: string,
    direction: number
  ): void {
    this._sortByDirectionSubject.next(direction);
    this._sortByFilterSubject.next(sortFns[filter]);
  }

  public filterBy(filter: string) {
    this._filterBySubject.next(filter);
  }

  // Make http request return Observable
  // Convert response into article class
  // Update our subject
  public getArticles(): void {
    this._makeHttpRequest('/v1/articles', 'reddit-r-all')
        .map(json => json.articles)
        .subscribe(articlesJSON => {
          const articles = articlesJSON
            .map(articlejson => Article.fromJSON(articlejson));
          this._articles.next(articles);
      });
  }

  private _makeHttpRequest(
    path: string,
    sourceKey: string
  ): Observable<any> {
    let params = new URLSearchParams();
    params.set('apiKey', environment.newsApiKey);
    params.set('source', sourceKey);

    return this.http
      //.get(baseUrl + '/v1/articles')
      // ES6 string interpelation syntax
      .get(`${environment.baseUrl}${path}`, {
        search: params
      }).map(res => res.json());
  }
}
