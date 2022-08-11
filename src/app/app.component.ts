import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { Category } from './models/category';
import { Todo } from './models/todo';
import { CheckTodo, CheckTodoResponse, CreateTodo, CreateTodoResponse, GetCategories, GetCategoriesResponse } from './services/graphql.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  data: Category[] = [];

  constructor(
    private dialog: MatDialog,
    private getCategories: GetCategories,
    private createTodo: CreateTodo,
    private checkTodo: CheckTodo
  ) {}

  ngOnInit(): void {
    this.getCategories.fetch().pipe(
        map(response => plainToInstance(GetCategoriesResponse, response.data, { excludeExtraneousValues: true })),
        map(data => data.categories) 
      ).subscribe(categories => {
        this.data = categories;
      });
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = this.data.map((category: Category): string => category.title);

    this.dialog.open(DialogComponent, dialogConfig).afterClosed().subscribe((formData) => {
      if (formData) {
        let categoryName = formData.customCategoryName ?? formData.categoryName;
        let text = formData.text;
        
        this.create(categoryName, text);
      }
    });
  }

  create(categoryName: string, text: string): void {
    this.createTodo.mutate({
      input: {
        categoryName: categoryName,
        text: text
      }
    }).pipe(
      map(response => plainToInstance(CreateTodoResponse, response.data, { excludeExtraneousValues: true })),
      map(data => data.createTodo)
    ).subscribe(todo => {
      let categoryIndex = this.data.findIndex((category: Category) => category.id === todo.category.id);
      if (categoryIndex >= 0) {
        this.data[categoryIndex].todos.push(todo);
      }
      else {
        let category = todo.category;
        category.todos = [todo];
        this.data.push(category);
      }
    });
  }

  check(todo: Todo): void {
    this.checkTodo.mutate({
      input: {
        id: todo.id,
        status: !todo.isCompleted
      }
    }).pipe(
      map(response => plainToInstance(CheckTodoResponse, response.data, { excludeExtraneousValues: true })),
      map(data => data.checkTodo)
    ).subscribe(todo => {
      let categoryIndex = this.data.findIndex((category: Category) => category.id === todo.category.id);
      let todoIndex = this.data[categoryIndex].todos.findIndex((_todo: Todo) => _todo.id === todo.id);
      this.data[categoryIndex].todos.splice(todoIndex, 1, todo);
    });
  }

  fit(size: number): number {
    return Math.floor(size / 4) + 1;
  }

  trackByFn(index: number, item: Category | Todo): number {
    return item.id;
  }
}