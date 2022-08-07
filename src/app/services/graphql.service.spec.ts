import { TestBed } from '@angular/core/testing';

import { GetCategories, CreateTodo, CheckTodo } from './graphql.service';

describe('GetCategories', () => {
  let service: GetCategories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCategories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('CreateTodo', () => {
  let service: CreateTodo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateTodo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('CheckTodo', () => {
  let service: CheckTodo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckTodo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
