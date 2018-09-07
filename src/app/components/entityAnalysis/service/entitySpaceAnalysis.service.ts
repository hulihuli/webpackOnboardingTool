import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';


import {ExperimentDto} from "../../../core/experimentDto"
import { EntitySpaceAnalysis } from '../../../core/entityAnalysis/entitySpaceAnalysis'

@Injectable()
export class EntitySpaceAnalysisService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private heroesUrl = 'api/entityspaceanalysis';  // URL to web api

  constructor(private http: Http) { }

  getEntitySpaceAnalysisDtos(): Promise<ExperimentDto[]> {
    return this.http.get(this.heroesUrl)
               .toPromise()
               .then(response => response.json().data as ExperimentDto[])
               .catch(this.handleError);
  }

  getEntitySpaceAnalysis(id: number): Promise<EntitySpaceAnalysis> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as ExperimentDto)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  update(hero: ExperimentDto): Promise<ExperimentDto> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http
      .put(url, JSON.stringify(hero), {headers: this.headers})
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}