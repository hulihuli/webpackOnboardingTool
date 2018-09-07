import { Injectable }    from '@angular/core';
import { Headers, Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


//self
import { ExperimentDto } from "../../../core/experimentDto"
import { EntitySpaceAnalysis } from "../../../core/entityAnalysis/entitySpaceAnalysis"


@Injectable()
export class AnalysisDashboardService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private entitySpaceAnalysisUrl = 'http://localhost:9001/api/entityspaceanalysis';  // URL to web api

  //private entitySpaceAnalysisDtos: EntitySpaceAnalysis[];//Array<EntitySpaceAnalysis>;
  private entityAnalysisDtos: any;//Array<EntitySpaceAnalysis>;

  constructor(private http: Http) { }


  getEntitySpaceAnalysisDtos(): Observable<any> {
    return this.http.get(this.entitySpaceAnalysisUrl)
                .map((response) => response.json());
  }

  // getEntitySpaceAnalysis(id: number) {
  //   const url = `${this.entitySpaceAnalysisUrl}/${id}`;    
  //   this.http.get<Array<EntitySpaceAnalysis>>(url)
  //              .subscribe(response => {
  //                this.entit
  //              }
  //   );
  // }

  delete(id: number): Promise<void> {
    const url = `${this.entitySpaceAnalysisUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
              .toPromise()
              .then(() => null)
              .catch(this.handleError);
  }

  create(name: string): Promise<ExperimentDto> {
    return this.http.post(this.entitySpaceAnalysisUrl, JSON.stringify({name: name}), {headers: this.headers})
              .toPromise()
              .then(res => res.json().data as ExperimentDto)
              .catch(this.handleError);
  }

  update(hero: ExperimentDto): Promise<ExperimentDto> {
    const url = `${this.entitySpaceAnalysisUrl}/${hero.id}`;
    return this.http.put(url, JSON.stringify(hero), {headers: this.headers})
              .toPromise()
              .then(() => hero)
              .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  // getEntitySpaceAnalysisDtos(): Promise<EntitySpaceAnalysis[]> {
  //   return this.http.get(this.entitySpaceAnalysisUrl)
  //              .toPromise()
  //              .then(response => response.json().data as EntitySpaceAnalysis[])
  //              .catch(this.handleError);
  // }

  // getEntitySpaceAnalysis(id: number): Promise<EntitySpaceAnalysis[]> {
  //   const url = `${this.entitySpaceAnalysisUrl}/${id}`;    
  //   return this.http.get(url)
  //              .toPromise()
  //              .then(response => response.json().data as EntitySpaceAnalysis[])
  //              .catch(this.handleError);
  // }

  // delete(id: number): Promise<void> {
  //   const url = `${this.entitySpaceAnalysisUrl}/${id}`;
  //   return this.http.delete(url, {headers: this.headers})
  //             .toPromise()
  //             .then(() => null)
  //             .catch(this.handleError);
  // }

  // create(name: string): Promise<ExperimentDto> {
  //   return this.http.post(this.entitySpaceAnalysisUrl, JSON.stringify({name: name}), {headers: this.headers})
  //             .toPromise()
  //             .then(res => res.json().data as ExperimentDto)
  //             .catch(this.handleError);
  // }

  // update(hero: ExperimentDto): Promise<ExperimentDto> {
  //   const url = `${this.entitySpaceAnalysisUrl}/${hero.id}`;
  //   return this.http.put(url, JSON.stringify(hero), {headers: this.headers})
  //             .toPromise()
  //             .then(() => hero)
  //             .catch(this.handleError);
  // }

  // private handleError(error: any): Promise<any> {
  //   console.error('An error occurred', error); // for demo purposes only
  //   return Promise.reject(error.message || error);
  // }
}