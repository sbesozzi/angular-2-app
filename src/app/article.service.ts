import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Article } from './article';
import { environment } from '../environments/environment';

@Injectable()
export class ArticleService {

  // Local instance of http service
  constructor(
    private http: Http
  ) { }

  // Return promise and resolve articles
  public getArticles(): Promise<Article[]> {
    let params = new URLSearchParams();

    // Set param, value required by Reddit
    params.set('apiKey', environment.newsApiKey);
    params.set('source', 'reddit-r-all');

    return this.http
      //.get(baseUrl + '/v1/articles')
      // ES6 string interpelation syntax
      .get(`${environment.baseUrl}/v1/articles`, {
        search: params
      })
      // Imported from rxjs
      .toPromise()
      // Response as json
      // Return list of article objects
      .then(res => res.json())
      .then(json => json.articles)
      .then(articles => {
        console.log('json', articles);
        // Create new article objects/Return only title & description
        return articles
          .map(article => Article.fromJSON(article));
      })
      .catch(err => {
        console.log('We got an error', err);
      });
  }
}
