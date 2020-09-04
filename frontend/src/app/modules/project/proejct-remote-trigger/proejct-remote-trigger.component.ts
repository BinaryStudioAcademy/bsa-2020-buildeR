import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RemoteTrigger } from '@shared/models/remote-trigger/remote-trigger';
import { RemoteTriggerType } from '@shared/models/remote-trigger/remote-trigger-type';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
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

  @Output() triggerCreate = new EventEmitter<RemoteTrigger>();
  @Output() triggerUpdate = new EventEmitter<RemoteTrigger>();
  @Output() triggerDelete = new EventEmitter<number>();

  @ViewChild('branch', { static: false }) instance: NgbTypeahead;
  @ViewChild('triggerForm') form: NgForm;

  branchInputFocus$ = new Subject<string>();
  branchInputClick$ = new Subject<string>();

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

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.branchInputClick$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.branchInputFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.branches.slice(0, 5)
        : this.branches.filter(b => b.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 5))
    );
  }

  constructor() { }

  ngOnInit(): void {
    if (this.createNewTrigger) {
      this.trigger = {} as RemoteTrigger;
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
