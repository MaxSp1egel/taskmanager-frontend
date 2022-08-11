import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Todo } from '../models/todo';
import { Query, Mutation, gql } from 'apollo-angular';
import { Expose, Type } from 'class-transformer';

export class GetCategoriesResponse {
  private _categories!: Category[];

  @Expose()
  @Type(() => Category) 
  public get categories(): Category[] {
    return this._categories;
  }

  public set categories(value: Category[]) {
    this._categories = value;
  }
}

export class CreateTodoResponse {
  private _createTodo!: Todo;

  @Expose() 
  @Type(() => Todo) 
  public get createTodo(): Todo {
    return this._createTodo;
  }

  public set createTodo(value: Todo) {
    this._createTodo = value;
  }
}

export class CheckTodoResponse {
  private _checkTodo!: Todo;

  @Expose() 
  @Type(() => Todo) 
  public get checkTodo(): Todo {
    return this._checkTodo;
  }

  public set checkTodo(value: Todo) {
    this._checkTodo = value;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetCategories extends Query<GetCategoriesResponse> {
  override document = gql`
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
}

@Injectable({
  providedIn: 'root'
})
export class CreateTodo extends Mutation {
  override document = gql`
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
}

@Injectable({
  providedIn: 'root'
})
export class CheckTodo extends Mutation {
  override document = gql`
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
}