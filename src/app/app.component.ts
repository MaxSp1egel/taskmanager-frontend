import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { QueryRef } from 'apollo-angular';
import { plainToClass } from 'class-transformer';
import { map, Subscription } from 'rxjs';
import { Category } from './models/category';
import { Todo } from './models/todo';
import { CheckTodo, CheckTodoResponse, CreateTodo, CreateTodoResponse, GetCategories, GetCategoriesResponse } from './services/graphql.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  data: Category[] = [];

  private categoriesQuery?: QueryRef<any>; 
  private querySubscription?: Subscription;

  constructor(
    private dialog: MatDialog,
    private getCategories: GetCategories,
    private createTodo: CreateTodo,
    private checkTodo: CheckTodo
  ) {}

  ngOnInit(): void {
    this.categoriesQuery = this.getCategories.watch();
    this.querySubscription = this.categoriesQuery.valueChanges
      .pipe(
        map(response => plainToClass(GetCategoriesResponse, response.data)),
        map(data => data.categories) 
      )
      .subscribe(categories => {
        this.data = categories;
      });
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
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
      map(response => plainToClass(CreateTodoResponse, response.data)),
      map(data => data.createTodo)
    ).subscribe(data => {
      this.categoriesQuery?.refetch();
    });
  }

  check(todo: Todo): void {
    this.checkTodo.mutate({
      input: {
        id: todo.id,
        status: !todo.isCompleted
      }
    }).pipe(
      map(response => plainToClass(CheckTodoResponse, response.data)),
      map(data => data.checkTodo)
    ).subscribe(data => {
      this.categoriesQuery?.refetch();
    });
  }

  fit(size: number): number {
    return Math.floor(size / 4) + 1;
  }
}