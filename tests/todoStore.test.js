// agent-notes: { ctx: "unit tests for TodoStore core logic", deps: ["src/todoStore.js"], state: active, last: "tara@2026-07-22" }
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { TodoStore } from '../src/todoStore.js';

// Mock localStorage for Node environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

describe('TodoStore', () => {
  let store;
  let mockStorage;

  beforeEach(() => {
    mockStorage = new MockLocalStorage();
    store = new TodoStore(mockStorage);
  });

  it('should initialize with an empty list of todos', () => {
    assert.deepEqual(store.getTodos(), []);
  });

  it('should add a new todo item', () => {
    const todo = store.addTodo('Buy groceries');
    assert.equal(todo.title, 'Buy groceries');
    assert.equal(todo.completed, false);
    assert.ok(todo.id);
    assert.equal(store.getTodos().length, 1);
  });

  it('should not add a todo with empty or whitespace title', () => {
    const todo = store.addTodo('   ');
    assert.equal(todo, null);
    assert.equal(store.getTodos().length, 0);
  });

  it('should toggle a todo item completed status', () => {
    const todo = store.addTodo('Read a book');
    store.toggleTodo(todo.id);
    assert.equal(store.getTodos()[0].completed, true);
    store.toggleTodo(todo.id);
    assert.equal(store.getTodos()[0].completed, false);
  });

  it('should delete a todo item', () => {
    const todo1 = store.addTodo('Task 1');
    const todo2 = store.addTodo('Task 2');
    store.deleteTodo(todo1.id);
    const todos = store.getTodos();
    assert.equal(todos.length, 1);
    assert.equal(todos[0].id, todo2.id);
  });

  it('should filter todos by active and completed status', () => {
    const todo1 = store.addTodo('Task 1');
    const todo2 = store.addTodo('Task 2');
    store.toggleTodo(todo1.id); // todo1 is completed, todo2 is active

    assert.equal(store.getFilteredTodos('all').length, 2);
    assert.equal(store.getFilteredTodos('active').length, 1);
    assert.equal(store.getFilteredTodos('active')[0].id, todo2.id);
    assert.equal(store.getFilteredTodos('completed').length, 1);
    assert.equal(store.getFilteredTodos('completed')[0].id, todo1.id);
  });

  it('should search todos by title query', () => {
    store.addTodo('Buy groceries');
    store.addTodo('Clean kitchen');
    store.addTodo('Buy milk');

    const searchResults = store.searchTodos('Buy');
    assert.equal(searchResults.length, 2);
  });

  it('should clear all completed todos', () => {
    const t1 = store.addTodo('Task 1');
    const t2 = store.addTodo('Task 2');
    store.toggleTodo(t1.id);
    store.clearCompleted();
    const todos = store.getTodos();
    assert.equal(todos.length, 1);
    assert.equal(todos[0].id, t2.id);
  });

  it('should persist state to storage', () => {
    store.addTodo('Persistent item');
    const newStore = new TodoStore(mockStorage);
    assert.equal(newStore.getTodos().length, 1);
    assert.equal(newStore.getTodos()[0].title, 'Persistent item');
  });
});
