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
  public disabled1 = signal(true);
  public disabled2 = signal(false);

  @Input() totalItems = 0;
  @Input() pageSize = 0;

  @Output() pageChange = new EventEmitter<number>();

  public currentPage = signal(1);

  get previousPage(): number {
    return Math.max(1, this.currentPage() - 1);
  }

  get followingPage(): number {
    return Math.min(this.pages, this.currentPage() + 1);
  }

  public get pages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  movePreviousPage() {
    if (this.currentPage() === 2) {
      this.disabled1.set(true);
    } 
    if (this.totalItems/this.pageSize > 1) {
      this.disabled2.set(false);
    }
    this.currentPage.set(this.currentPage() - 1);
    this.pageChange.emit(this.currentPage());
  }

  moveFollowingPage() {
    if (Math.floor(this.totalItems / this.pageSize) === this.currentPage()) {
      this.disabled2.set(true);
    } 
    this.disabled1.set(false);
    this.currentPage.set(this.currentPage() + 1);
    this.pageChange.emit(this.currentPage());
  }
}
