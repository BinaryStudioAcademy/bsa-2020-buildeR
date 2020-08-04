import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }
  openModalWithComponent(): void {
    const message = 'Are you sure?';
    const text = 'You will not be able to recover this imaginary file';
    console.log(this.modalService.open(message, text));
    // if (this.modalService.open(message, text)){
    //   alert('you confirmed');
    // }
    // else{
    //   alert('you declined');
    // }
  }

}
