import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { TabRoute } from '@shared/models/tabs/tab-route';
import { BuildHistory } from '@shared/models/build-history';
import { BuildStatus } from '@shared/models/build-status';

@Component({
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.sass']
})
export class InsightsComponent implements OnInit {
  user: User = this.authService.getCurrentUser();
  now: Date = new Date(Date.now());
  totalBuilds = 0;
  totalDuration = 0;
  buildSuccessRate = 0;
  tab = 0;

  dataForBuilds;
  dataForDuration;
  dataForSuccess;

  weekMonth = [
    { name: 'Week' },
    { name: 'Month' },
  ];

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    // mock
    this.user.builds = [];
    this.user.builds.push({
      id : 1,
      number: 1,
      performer: this.user,
      branchHash: null,
      buildAt: this.now,
      buildStatus: 0,
      commitHash: null,
      duration: 10
    }, {
      id : 2,
      number: 2,
      performer: this.user,
      branchHash: null,
      buildAt: new Date(2020, 7, 25),
      buildStatus: 2,
      commitHash: null,
      duration: 19
    });
    console.log(this.user.builds);
    this.totalBuilds = this.totalBuildsCount();
    this.totalDuration = this.user.builds.map(this.duration).reduce(this.sum);
    this.buildSuccessRate = this.buildSucceedCount();
    this.showWeek();
  }

  buildSucceedCount(){
    if (this.user.builds.length) {
      const total = this.user.builds.length;
      const successBuilds = this.user.builds.filter(x => x.buildStatus === BuildStatus.Success).length;
      return  Math.round((successBuilds / total * 100));
    }
    return 0;
  }
  totalBuildsCount(){
    if (this.user.builds.length) {
      return this.user.builds.length;
    }
    return 0;
  }

  changeMode(i: number){
    console.log(this.countBuildsInDay(this.now));
    this.tab = i;
    if (!i){
      this.showWeek();
    }
  }
  showWeek(){
    const diff = this.diffDates(this.now, this.user.createdAt);
    if (diff <= 7){
      console.log(this.createDataForBuildsChart(this.user.createdAt, diff));
      this.dataForBuilds = this.createDataForBuildsChart(this.user.createdAt, diff);
      this.dataForDuration = this.createDataForDuration(this.user.createdAt, diff);
      this.dataForSuccess = this.createDataForSuccess(this.user.createdAt, diff);
    }
  }

  createDataForBuildsChart(startDate: Date, days: number){
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay =  new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      const value = this.countBuildsInDay(newDay);
      const name = this.beautifyDate(newDay);
      console.log(name);
      result.push({name, value});
    }
    return [{name: 'builds', series: result}];
  }

  createDataForDuration(startDate: Date, days: number){
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay =  new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      const value = this.countDurationInDay(newDay);
      const name = this.beautifyDate(newDay);
      result.push({name, value});
    }
    return [{name: 'minutes', series: result}];
  }

  createDataForSuccess(startDate: Date, days: number){
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay =  new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      const value = this.CountSucceedBuildsInDay(newDay);
      const name = this.beautifyDate(newDay);
      result.push({name, value});
    }
    return [{name: 'Succeed', series: result}];
  }

  beautifyDate(newDay: Date){
    newDay = new Date(newDay);
    if (newDay.getMonth() + 1 < 10){
      return newDay.getDate() + '.0' + (newDay.getMonth() + 1);
    }
    return newDay.getDay() + '.' + (newDay.getMonth() + 1);
  }

  countBuildsInDay(day: Date){
    day = new Date(day);
    console.log(day);
    return this.user.builds.filter(x => x.buildAt.getDay() === day.getDay()).length;
  }

  CountSucceedBuildsInDay(day: Date){
    day = new Date(day);
    return this.user.builds.filter(x => x.buildAt.getDay() === day.getDay()
    && x.buildStatus === BuildStatus.Success).length;
  }

  countDurationInDay(day: Date){
    day = new Date(day);
    const builds = this.user.builds.filter(x => x.buildAt.getDay() === day.getDay());
    console.log(builds);
    if (builds.length > 0){
      console.log(builds.map(this.duration).reduce(this.sum));
      return builds.map(this.duration).reduce(this.sum);
    }
    return 0;
  }

  diffDates(dateOne: Date, dateTwo: Date): number {
    dateOne = new Date(dateOne);
    dateTwo = new Date(dateTwo);
    return Math.floor((dateOne.getTime() - dateTwo.getTime()) / (60 * 60 * 24 * 1000));
}

  duration(history: BuildHistory){
    return history.duration;
  }
  sum(prev, next){
    return prev + next;
  }

  dateTickFormatting(val): string {
    if (val instanceof Date) {
      const options = { month: 'long', day: 'numeric' };
      return (val as Date).toLocaleString('en-US', options);
    }
  }

}
