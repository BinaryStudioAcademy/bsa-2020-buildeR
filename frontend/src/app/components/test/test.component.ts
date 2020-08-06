import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ToastrNotificationsService } from '../../services/toastr-notifications.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent implements OnInit {

  constructor(private modalService: ModalService, private toastrService: ToastrNotificationsService) { }

  ngOnInit(): void {
  }

  async callModal(){
    const res = await this.modalService.open();
    if (res){
      console.log('confirmed');
    }
    else{
      console.log('declined');
    }
  }
  toastrInfo() {
    this.toastrService.showInfo('You have new info');
  }
  toastrError() {
    this.toastrService.showError('Somthsing went wrong');
  }
  toastrWarning() {
    this.toastrService.showWarning();
  }
  toastrSuccess() {
    this.toastrService.showSuccess('Instance was created');
  }
}
