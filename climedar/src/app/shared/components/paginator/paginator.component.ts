import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import {MatRipple} from '@angular/material/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  imports: [
    MatRipple
  ],
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() totalItems = 0;
  @Input() pageSize = 0;
  @Input() currentPage = signal(1);

  @Output() pageChange = new EventEmitter<number>();

  public get pages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  disabled1() {
    return this.currentPage() === 1;
  }

  disabled2() {
    return this.currentPage() === this.pages;
  }

  movePreviousPage() {
    this.currentPage.set(this.currentPage() - 1);
    this.pageChange.emit(this.currentPage());
  }

  moveFollowingPage() {
    this.currentPage.set(this.currentPage() + 1);
    this.pageChange.emit(this.currentPage());
  }
}
