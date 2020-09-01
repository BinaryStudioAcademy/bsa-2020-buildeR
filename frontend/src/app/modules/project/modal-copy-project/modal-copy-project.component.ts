import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from 'src/app/shared/models/project/project';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-copy-project',
  templateUrl: './modal-copy-project.component.html',
  styleUrls: ['./modal-copy-project.component.sass']
})
export class ModalCopyProjectComponent implements OnInit {
  public copyForm: FormGroup;
  constructor(private projectService: ProjectService, private activeModal: NgbActiveModal) { }
  @Input() id: number;
  project: Project = {} as Project;
  ngOnInit(): void {
    this.projectService.getProjectById(this.id).subscribe((res) => {
      this.project = res; this.copyForm = new FormGroup({
        name: new FormControl(`${this.project.name}` + `-Copy`,
          [Validators.required]),
        description: new FormControl(this.project.description),
        isPublic: new FormControl(this.project.isPublic.toString())
      });
    });
  }
  save() {
    const Name = this.copyForm.value[`name`];
    if (Name === '') {
      this.project.name = null;
    }
    else {
      this.project.name = this.copyForm.value[`name`];
    }
    const Description = this.copyForm.value[`description`];
    if (Description === '') {
      this.project.description = null;
    }
    else {
      this.project.description = this.copyForm.value[`description`];
    }
    this.project.isPublic = this.copyForm.value['isPublic'];
    this.projectService.copyProject(this.project).subscribe((result) => {
      this.project = result;
      this.activeModal.close(this.project);
    });
  }
  onCancel() {
    this.activeModal.close();
  }
}
