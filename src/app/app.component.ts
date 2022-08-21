import { Component, OnInit } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { Category } from './models/category';
import { Todo } from './models/todo';
import { GetCategories, GetCategoriesResponse } from './services/graphql.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  data: Category[] = [];

  constructor(
    private getCategories: GetCategories
  ) {}

  ngOnInit(): void {
    this.getCategories.fetch().pipe(
        map(response => plainToInstance(GetCategoriesResponse, response.data)),
        map(data => data.categories) 
      ).subscribe(categories => {
        this.data = categories;
      });
  }

  addTodo(todo: Todo): void {
    let categoryIndex = this.data.findIndex((category: Category) => category.id === todo.category.id);
    if (categoryIndex >= 0) {
      this.data[categoryIndex].todos.push(todo);
    }
    else {
      let category = todo.category;
      category.todos = [todo];
      this.data.push(category);
    }
  }

  fit(size: number): number {
    return Math.floor(size / 4) + 1;
  }

  trackByFn(index: number, item: Category): number {
    return item.id;
  }
}