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
  // Initial value as empty array
  private _articles: BehaviorSubject<Article[]> =
    new BehaviorSubject<Article[]>([]);
  private _sources: BehaviorSubject<any> =
    new BehaviorSubject<any>([]);
  private _refreshSubject: BehaviorSubject<string> = new
    BehaviorSubject<string>('reddit-r-all');
  private _sortByDirectionSubject:
    BehaviorSubject<number> = new
    BehaviorSubject<number>(1);
  private _sortByFilterSubject:
    BehaviorSubject<ArticleSortOrderFn> = new
    BehaviorSubject<ArticleSortOrderFn>(sortByTime);

  private _filterBySubject:
    BehaviorSubject<string> = new
    BehaviorSubject<string>('');


  // Instance value of attribute acts as Observable
  public sources: Observable<any> = this._sources.asObservable();
  public articles: Observable<Article[]> = this._articles.asObservable();
  public orderedArticles: Observable<Article[]>;

  // Local instance of http service
  constructor(
    private http: Http
  ) {
    // Setup subscription to getArticles
    this._refreshSubject
        .subscribe(this.getArticles.bind(this));

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
  // Update our BehaviorSubject
  public updateArticles(sourceKey): void {
    this._refreshSubject.next(sourceKey);
  }

  public getArticles(sourceKey = 'reddit-r-all'): void {
    this._makeHttpRequest('/v1/articles', sourceKey)
        .map(json => json.articles)
        .subscribe(articlesJSON => {
          const articles = articlesJSON
            .map(articlejson => Article.fromJSON(articlejson));
          this._articles.next(articles);
      });
  }

  public getSources(): void {
    this._makeHttpRequest('/v1/sources')
        .map(json => json.sources)
        .filter(list => list.length > 0)
        .subscribe(this._sources);
  }

  private _makeHttpRequest(
    path: string,
    sourceKey?: string
  ): Observable<any> {
    let params = new URLSearchParams();

    params.set('apiKey', environment.newsApiKey);
    // Optional sourceKey check
    if (sourceKey && sourceKey !== '') {
      params.set('source', sourceKey);
    }

    return this.http
      //.get(baseUrl + '/v1/articles')
      // ES6 string interpelation syntax
      .get(`${environment.baseUrl}${path}`, {
        search: params
      }).map(res => res.json());

  }
}
