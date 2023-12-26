import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, mergeMap, of } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient,private datePipe: DatePipe) {}

  allIds: number[] = [];
  alljobs: any[] = [];
  title = 'Hacker News Job Board';
  jobIdUrl = 'https://hacker-news.firebaseio.com/v0';

  startIndex = 0;
  pageSize = 6;

  ngOnInit() {
    this.getJobId(this.jobIdUrl, 6);
  }
  getJobId(jobIdUrl: any, noOfRecords: number) {
    this.http.get<number[]>(`${jobIdUrl}/jobstories.json`).subscribe((data) => {
      this.allIds = data;
      console.log(this.allIds, 'p');
      this.getJobs();
    });
  }

  getJobs() {
    const ids = this.allIds.slice(this.startIndex, this.pageSize);
    this.startIndex = this.pageSize;
    this.pageSize += 6;

    const observables = ids.map((id) =>
      this.http.get<any>(`${this.jobIdUrl}/item/${id}.json`)
    );

    forkJoin(observables).subscribe((jobs: any[]) => {
      this.alljobs = [...this.alljobs, ...jobs];
      console.log(this.alljobs, 'k');
    });
  }

  formatTimestamp(timestamp: number): string {
    const milliseconds = timestamp * 1000;
    const formattedDateTime = this.datePipe.transform(milliseconds, 'yyyy-MM-dd HH:mm:ss');
    return formattedDateTime || ''; 
  }

  navigateToJob(e:any){
    window.open(e);
  }
}
