import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() pages = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get previousPage(): number {
    return Math.max(1, this.currentPage - 1);
  }

  get followingPage(): number {
    return Math.min(this.pages, this.currentPage + 1);
  }

  movePreviousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.previousPage);
    }
  }

  moveFollowingPage() {
    if (this.currentPage < this.pages) {
      this.pageChange.emit(this.followingPage);
    }
  }

  moveToPage(page: number) {
    if (page >= 1 && page <= this.pages) {
      this.pageChange.emit(page);
    }
  }
}
