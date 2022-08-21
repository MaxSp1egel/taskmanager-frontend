import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  @Input()
  category!: Category;

  constructor() {}

  trackByFn(index: number, item: Todo): number {
    return item.id;
  }
}
