import { Component, OnInit } from '@angular/core';
import { P } from '../project.component';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {
  project: P = { username: 'Username', projectName: 'ProjectName', descriptios: 'some description'} ;
  projectTemp: P = { username: this.project.username, projectName: this.project.projectName, descriptios: this.project.descriptios} ;
  constructor() { }

  ngOnInit(): void {
  }
  save() {}
}
