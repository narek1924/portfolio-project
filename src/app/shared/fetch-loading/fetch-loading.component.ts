import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { DataStorageService } from '../data-storage-service/data-storage.service';

@Component({
  selector: 'app-fetch-loading',
  template: `<div class="lds-dual-ring"></div>`,
  styleUrls: ['./fetch-loading.component.scss'],
})
export class FetchLoadingComponent {}
