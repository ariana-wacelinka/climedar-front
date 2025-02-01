import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
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
    if (this.currentPage() > 1) {
      this.disabled1.set(false);
      this.disabled2.set(false);
      this.currentPage.set(this.previousPage);
      this.pageChange.emit(this.previousPage);
    } else if (this.currentPage() === 1) {
      this.disabled1.set(true);
    }
  }

  moveFollowingPage() {
    if (this.currentPage() < this.pages) {
      this.disabled2.set(false);
      this.disabled1.set(false);
      this.currentPage.set(this.followingPage);
      this.pageChange.emit(this.followingPage);
    } else if (this.currentPage() === this.pages) {
      this.disabled2.set(true);
    }
  }
}
