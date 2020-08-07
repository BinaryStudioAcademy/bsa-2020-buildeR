import { Component, OnInit, Input, ViewChild, ElementRef, Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../models/user';
import { UserSettingsService } from '../../../services/user-settings.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrNotificationsService } from 'src/app/services/toastr-notifications.service';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.sass']
})
export class UserSettingsComponent implements OnInit {

  @Input() details: User = {} as User;
  public settingsForm: FormGroup;
  public formData: FormData;
  public rootPath: string;
  @ViewChild('file', {static : false}) imageInput: ElementRef;
  constructor(
    private settingsService: UserSettingsService,
    private toastrNotification: ToastrNotificationsService) { }

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      firstName: new FormControl(this.details.firstName,
        [
          Validators.required
        ]),
      lastName: new FormControl(this.details.lastName,
         [
           Validators.required
        ]),
      email: new FormControl(this.details.email,
        [
          Validators.email,
          Validators.required
        ]),
        location: new FormControl(this.details.location),
        username: new FormControl(this.details.username),
        bio : new FormControl(this.details.bio,
          [
            Validators.maxLength(200)
          ])
    });

    /*const rootPath$ = this.settingsService.getRootPath();

    const httpResult$ = rootPath$.pipe(switchMap(result => {
        this.rootPath = result;
        return this.settingsService.getLastUploadedPhoto();
    }))
    .subscribe(url =>
    {
      this.details.avatarUrl = this.rootPath + url;
    }, error =>
    {
      this.toastrNotification.showWarning(error.value);
    });*/
  }

  public upload(event: any): void {
    const file = event.target.files[0];
    this.formData = new FormData();
    this.formData.append('file', file, file.name);
    this.settingsService.uploadImage(this.formData)
    .subscribe(response =>
    {
      console.log(response);
      this.toastrNotification.showSuccess('Img uploaded to server');
      this.changeAvatar(response);
    },
    error => this.toastrNotification.showError('Something went wrong'));
  }

  public changeAvatar(file: string){
    this.details.avatarUrl = this.rootPath + file;
    this.imageInput.nativeElement.value = '';
  }
}
