import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';
import { VariableValue } from '@shared/models/environment-variable/variable-value';
import { ProjectService } from '@core/services/project.service';

@Component({
  selector: 'app-env-vars-editor',
  templateUrl: './env-vars-editor.component.html',
  styleUrls: ['./env-vars-editor.component.sass']
})
export class EnvVarsEditorComponent implements OnInit {

  public envVarsEditForm: FormGroup;
  @Input() index: number;
  @Input()envVar: EnviromentVariable = { data: {} as VariableValue} as EnviromentVariable;
  @Output()editing: EventEmitter<EnviromentVariable> = new EventEmitter<EnviromentVariable>();
  @Output()deleting: EventEmitter<EnviromentVariable> = new EventEmitter<EnviromentVariable>();
  fieldTextType = false;

  constructor(private pojectService: ProjectService) { }

  ngOnInit(): void {
    this.envVarsEditForm = new FormGroup({
      name: new FormControl(this.envVar.data.name,
        [
          Validators.required
        ]),
      value: new FormControl(this.envVar.data.value,
        [
          Validators.required
        ]),
        isSecret: new FormControl(this.envVar.data.isSecret)
    });
    console.log(this.envVar);
    this.fieldTextType = this.envVar.data.isSecret;

  }
  changeSecret() {
    this.fieldTextType = this.envVar.data.isSecret;
  }
  edit(){
    this.envVar.data = this.envVarsEditForm.value;
    this.pojectService.editEnvVarEvent(this.envVar);
  }

  delete(){
    this.envVar.data = this.envVarsEditForm.value;
    this.pojectService.deleteEnvVarEvent(this.envVar);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
