import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/shared/models/project/project';

export interface P {
  username: string;
  projectName: string;
  descriptios: string;
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass']
})
export class ProjectComponent implements OnInit {

  project2: Project = {} as Project;
  project: P = { username: 'Username', projectName: 'ProjectName', descriptios: 'some description'} ;
  projectTemp: P = { username: this.project.username, projectName: this.project.projectName, descriptios: this.project.descriptios} ;
  constructor() { }

  ngOnInit(): void {
  }

}
