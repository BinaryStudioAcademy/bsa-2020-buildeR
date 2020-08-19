import { Project } from 'src/app/shared/models/project/project';
import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@core/services/project.service';
import { ToastrNotificationsService } from '@core/services/toastr-notifications.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {
  isLoading = false;
  projectId: number;
  public projectForm: FormGroup;
  @Input() project: Project = {} as Project;
  constructor(
    private projectService: ProjectService,
    private toastrService: ToastrNotificationsService,
    private route: ActivatedRoute
  )
  {
    route.parent.params.subscribe(
      (params) => this.projectId = params.projectId);
    this.route.parent.data.subscribe(data => this.project = data.project);
  }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl(this.project.name,
        [
          Validators.required
        ]),
        isPublic: new FormControl(this.project.isPublic),
        description: new FormControl(this.project.description,
          [
            Validators.required
          ])
    });
  }


  reset() {
  }
  save() {
  }
}
