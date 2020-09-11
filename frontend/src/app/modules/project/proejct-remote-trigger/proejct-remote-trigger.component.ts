import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RemoteTrigger } from '@shared/models/remote-trigger/remote-trigger';
import { RemoteTriggerType } from '@shared/models/remote-trigger/remote-trigger-type';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-proejct-remote-trigger',
  templateUrl: './proejct-remote-trigger.component.html',
  styleUrls: ['./proejct-remote-trigger.component.sass']
})
export class ProejctRemoteTriggerComponent implements OnInit {

  @Input() trigger: RemoteTrigger;
  @Input() branches: string[];
  @Input() createNewTrigger: boolean;
  @Input() order: number;

  @Output() triggerCreate = new EventEmitter<RemoteTrigger>();
  @Output() triggerUpdate = new EventEmitter<RemoteTrigger>();
  @Output() triggerDelete = new EventEmitter<number>();

  @ViewChild('branch', { static: false }) instance: NgbTypeahead;
  @ViewChild('triggerForm') form: NgForm;

  readonly pushEvent = 'Push';
  readonly pullRequestEvent = 'Pull request';

  readonly eventsList = [
    this.pushEvent,
    this.pullRequestEvent,
  ];

  selectedEvents = [];

  selectedEventsChanged: boolean;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  ngOnInit(): void {
    if (this.createNewTrigger) {
      this.trigger = {
        branch: this.branches?.[0]
      } as RemoteTrigger;
    }
    else {
      if (this.trigger.type & RemoteTriggerType.Push) {
        this.selectedEvents.unshift(this.pushEvent);
      }

      if (this.trigger.type & RemoteTriggerType.PullRequest) {
        this.selectedEvents.unshift(this.pullRequestEvent);
      }
    }
  }

  saveEditedTrigger() {
    this.trigger.type = RemoteTriggerType.Undefined;

    if (this.selectedEvents.includes(this.pushEvent)) {
      this.trigger.type = RemoteTriggerType.Push;
    }

    if (this.selectedEvents.includes(this.pullRequestEvent)) {
      this.trigger.type |= RemoteTriggerType.PullRequest;
    }

    this.triggerUpdate.emit(this.trigger);
    this.selectedEventsChanged = false;
  }

  createTrigger() {
    if (this.selectedEvents.includes(this.pushEvent)) {
      this.trigger.type = RemoteTriggerType.Push;
    }

    if (this.selectedEvents.includes(this.pullRequestEvent)) {
      this.trigger.type |= RemoteTriggerType.PullRequest;
    }

    this.triggerCreate.emit(this.trigger);
    this.form.reset();
    this.selectedEvents = [];
  }

  deleteTrigger() {
    this.triggerDelete.emit(this.trigger.id);
  }

  eventsOnChange() {
    this.selectedEventsChanged = true;
  }
}
