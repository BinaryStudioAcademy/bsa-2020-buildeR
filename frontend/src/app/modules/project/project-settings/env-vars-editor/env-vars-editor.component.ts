import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { EnviromentVariable } from '@shared/models/environment-variable/enviroment-variable';
import { VariableValue } from '@shared/models/environment-variable/variable-value';
import { ProjectService } from '@core/services/project.service';

@Component({
  selector: 'app-env-vars-editor',
  templateUrl: './env-vars-editor.component.html',
  styleUrls: ['./env-vars-editor.component.sass']
})
export class EnvVarsEditorComponent implements OnInit {

  envVarsEditForm: FormGroup;
  @Input() index: number;
  @Input()envVariables: EnviromentVariable[];
  @Input()envVar: EnviromentVariable = { data: {} as VariableValue} as EnviromentVariable;
  @Output()editing: EventEmitter<EnviromentVariable> = new EventEmitter<EnviromentVariable>();
  @Output()deleting: EventEmitter<EnviromentVariable> = new EventEmitter<EnviromentVariable>();
  fieldTextType = false;
  isInit = false;
  cashedEnvVariables: EnviromentVariable[] = [];
  constructor(private pojectService: ProjectService) { }

  ngOnInit(): void {
    this.envVarsEditForm = new FormGroup({
      name: new FormControl(this.envVar.data.name,
        [
          Validators.required,
          this.isNotUniqueName()
        ]),
      value: new FormControl(this.envVar.data.value,
        [
          Validators.required
        ]),
        isSecret: new FormControl(this.envVar.data.isSecret)
    });
    this.fieldTextType = this.envVar.data.isSecret;
    this.cashedEnvVariables = this.envVariables.filter(x => x.data.name !== this.envVar.data.name);
    this.isInit = true;
  }
  isNotUniqueName(): ValidatorFn {
    return control => {
      const isNotUnique = this.cashedEnvVariables.some(x => x.data.name === control.value);
      return isNotUnique ? { isNotUniqueName: {value: control.value}} : null;
    };
  }
  isNotUniqueCheckChanges(input: string): boolean {
    return this.cashedEnvVariables.some(x => x.data.name === input);
  }
  changeSecret() {
    this.fieldTextType = this.envVar.data.isSecret;
  }
  edit() {
    this.isInit = false;
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
