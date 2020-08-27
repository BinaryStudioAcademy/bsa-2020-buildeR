import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { User } from '@shared/models/user/user';
import { Project } from '@shared/models/project/project';
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
  activeProjects = 0;
  tab = 0;

  buildsData;
  durationData;
  successData;
  bigChartData;
  projectData;

  weekMonth = [
    { name: 'Week' },
    { name: 'Month' },
  ];

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    // mock
    this.user.builds = [];
    this.user.builds.push({
      id: 1,
      number: 1,
      project: { id: 1 } as Project,
      performer: this.user,
      branchHash: null,
      buildAt: this.now,
      buildStatus: 0,
      commitHash: null,
      duration: 10
    }, {
      id: 2,
      number: 2,
      project: { id: 2 } as Project,
      performer: this.user,
      branchHash: null,
      buildAt: new Date(2020, 7, 25),
      buildStatus: 2,
      commitHash: null,
      duration: 19
    },
      {
        id: 3,
        number: 2,
        performer: this.user,
        project: { id: 1 } as Project,
        branchHash: null,
        buildAt: new Date(2020, 7, 25),
        buildStatus: 1,
        commitHash: null,
        duration: 19
      },
      {
        id: 4,
        number: 2,
        performer: this.user,
        project: { id: 1 } as Project,
        branchHash: null,
        buildAt: new Date(2020, 7, 25),
        buildStatus: 2,
        commitHash: null,
        duration: 19
      },
      {
        id: 5,
        number: 2,
        performer: this.user,
        project: { id: 2 } as Project,
        branchHash: null,
        buildAt: new Date(2020, 7, 25),
        buildStatus: 3,
        commitHash: null,
        duration: 19
      });
    // end of mock


    this.totalBuilds = this.totalBuildsCount();
    this.totalDuration = this.user.builds.map(this.duration).reduce(this.sum);
    this.buildSuccessRate = this.buildSucceedCount();
    this.activeProjects = this.countActiveProjects();
    this.countActiveProjects();
    this.getData();
  }

  getData(isMonth = false) {
    const diff = this.diffDates(this.now, this.user.createdAt);
    if (diff <= 7) {
      this.fulfillCharts(this.user.createdAt, diff);
      return;
    }
    if (!(diff <= 7) && isMonth){
      // tslint:disable-next-line: no-shadowed-variable
      const date = new Date(this.now);
      date.setDate(date.getDate() - 30);
      this.fulfillCharts(date, 30);
      return;
    }
    const date = new Date(this.now);
    date.setDate(date.getDate() - 6);
    this.fulfillCharts(date, 6);
    return;
  }

  fulfillCharts(startDate: Date, days: number){
    this.buildsData = this.formatBuildsData(startDate, days);
    this.durationData = this.formatDurationData(startDate, days);
    this.successData = this.formatSuccessData(startDate, days);
    this.projectData = this.formatProjectData(startDate, days);
    this.bigChartData = this.formatBigChartData(startDate, days);
    return;
  }

  formatBigChartData(startDate: Date, days: number) {
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay = new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      // name for result
      const day = this.beautifyDate(newDay);
      // counting successfull builds
      const successCount = this.countBuildsByStatus(newDay, 0);
      const failCount = this.countBuildsByStatus(newDay, 1);
      const errorCount = this.countBuildsByStatus(newDay, 2);
      const canceledCount = this.countBuildsByStatus(newDay, 3);
      const value = [
        { name: 'Succeed', value: successCount },
        { name: 'Failed', value: failCount },
        { name: 'Errored', value: errorCount },
        { name: 'Canceled', value: canceledCount }];

      result.push({ name: day, series: value });
    }
    return result;
  }

  formatProjectData(startDate: Date, days: number) {
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay = new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      console.log(newDay);
      const value = this.countActiveProjectsInDay(newDay);
      const name = this.beautifyDate(newDay);
      result.push({ name, value });
    }
    return [{ name: 'projects', series: result }];
  }

  formatBuildsData(startDate: Date, days: number) {
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay = new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      const value = this.countBuildsInDay(newDay);
      const name = this.beautifyDate(newDay);
      result.push({ name, value });
    }
    return [{ name: 'builds', series: result }];
  }

  formatDurationData(startDate: Date, days: number) {
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay = new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      const value = this.countDurationInDay(newDay);
      const name = this.beautifyDate(newDay);
      result.push({ name, value });
    }
    return [{ name: 'minutes', series: result }];
  }

  formatSuccessData(startDate: Date, days: number) {
    const result = new Array();
    startDate = new Date(startDate);
    for (let index = 0; index <= days; index++) {
      const newDay = new Date(startDate);
      newDay.setDate(newDay.getDate() + index);
      const value = this.countBuildsByStatus(newDay, 0);
      const name = this.beautifyDate(newDay);
      result.push({ name, value });
    }
    return [{ name: 'Succeed', series: result }];
  }

  countActiveProjects(){
    return [...new Set(this.user.builds.map(item => item.project.id))].length;
  }

  beautifyDate(newDay: Date) {
    newDay = new Date(newDay);
    if (newDay.getMonth() + 1 < 10) {
      return newDay.getDate() + '.0' + (newDay.getMonth() + 1);
    }
    return newDay.getDate() + '.' + (newDay.getMonth() + 1);
  }

  countActiveProjectsInDay(day: Date) {
    day = new Date(day);
    return [...new Set(this.user.builds.filter(x => x.buildAt.getDate() === day.getDate())
      .map(item => item.project.id))].length;
  }
  countBuildsInDay(day: Date) {
    day = new Date(day);
    return this.user.builds.filter(x => x.buildAt.getDate() === day.getDate()).length;
  }

  countBuildsByStatus(day: Date, status: number = 0) {
    day = new Date(day);
    return this.user.builds.filter(x => x.buildAt.getDate() === day.getDate()
      && x.buildStatus === status).length;
  }

  countDurationInDay(day: Date) {
    day = new Date(day);
    const builds = this.user.builds.filter(x => x.buildAt.getDate() === day.getDate());
    if (builds.length > 0) {
      return builds.map(this.duration).reduce(this.sum);
    }
    return 0;
  }

  buildSucceedCount() {
    if (this.user.builds.length) {
      const total = this.user.builds.length;
      const successBuilds = this.user.builds.filter(x => x.buildStatus === BuildStatus.Success).length;
      return Math.round((successBuilds / total * 100));
    }
    return 0;
  }
  totalBuildsCount() {
    if (this.user.builds.length) {
      return this.user.builds.length;
    }
    return 0;
  }

  changeMode(i: number) {
    this.tab = i;
    if (!i) {
      this.getData();
      return;
    }
    this.getData(true);
  }

  diffDates(dateOne: Date, dateTwo: Date): number {
    dateOne = new Date(dateOne);
    dateTwo = new Date(dateTwo);
    return Math.floor((dateOne.getTime() - dateTwo.getTime()) / (60 * 60 * 24 * 1000));
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  duration(history: BuildHistory) {
    return history.duration;
  }
  sum(prev, next) {
    return prev + next;
  }

  dateTickFormatting(val): string {
    if (val instanceof Date) {
      const options = { month: 'long', day: 'numeric' };
      return (val as Date).toLocaleString('en-US', options);
    }
  }

}
