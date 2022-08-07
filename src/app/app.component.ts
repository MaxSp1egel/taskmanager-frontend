import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { plainToClass } from 'class-transformer';
import { Subscription } from 'rxjs';
import { Category } from './category';
import { Todo } from './todo';

const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      id
      title
      todos {
        id
        text
        isCompleted
      }
    }
  }
`;

export class GetCategoriesResponse {
  private _categories!: Category[];

  public get categories(): Category[] {
    return this._categories;
  }

  public set categories(value: Category[]) {
    this._categories = value;
  }
}

const CREATE_TODO = gql`
  mutation createTodo($input: CreateTodoArgs!) {
    createTodo(input: $input) {
      category {
        id
        title
      }
      id
      text
      isCompleted
    }
  }
`;

export class CreateTodoResponse {
  private _createTodo!: Todo;

  public get createTodo(): Todo {
    return this._createTodo;
  }

  public set createTodo(value: Todo) {
    this._createTodo = value;
  }
}

const CHECK_TODO = gql`
  mutation checkTodo($input: CheckTodoArgs!) {
    checkTodo(input: $input) {
      category {
        id
        title
      }
      id
      text
      isCompleted
    }
  }
`;

export class CheckTodoResponse {
  private _checkTodo!: Todo;

  public get checkTodo(): Todo {
    return this._checkTodo;
  }

  public set checkTodo(value: Todo) {
    this._checkTodo = value;
  }
}

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
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.categoriesQuery = this.apollo.watchQuery<any>({
      query: GET_CATEGORIES
    });
    this.querySubscription = this.categoriesQuery.valueChanges.subscribe(({ data }) => {
      try {
        let responseData: GetCategoriesResponse = plainToClass(GetCategoriesResponse, data);
        if (responseData && responseData.categories) {
          this.data = responseData.categories;
        }
        else {
          throw new Error('Не удалось получить данные с сервера');
        }
      }
      catch (error) {
        console.log(error);
      }
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
    this.apollo.mutate({
      mutation: CREATE_TODO,
      variables: {
        input: {
          categoryName: categoryName,
          text: text
        }
      }
    }).subscribe(({ data }) => {
      try {
        let responseData: CreateTodoResponse = plainToClass(CreateTodoResponse, data);
        if (responseData && responseData.createTodo) {
          this.categoriesQuery?.refetch();
        } 
        else {
          throw new Error('Не удалось получить данные с сервера');
        }
      }
      catch (error) {
        console.log(error);
      }
    });
  }

  check(todo: Todo): void {
    this.apollo.mutate({
      mutation: CHECK_TODO,
      variables: {
        input: {
          id: todo.id,
          status: !todo.isCompleted
        }
      }
    }).subscribe(({ data }) => {
      try {
        let responseData: CheckTodoResponse = plainToClass(CheckTodoResponse, data);
        if (responseData && responseData.checkTodo) {
          this.categoriesQuery?.refetch();
        } 
        else {
          throw new Error('Не удалось получить данные с сервера');
        }
      }
      catch (error) {
        console.log(error);
      }
    });
  }

  fit(size: number): number {
    return Math.floor(size / 4) + 1;
  }
}