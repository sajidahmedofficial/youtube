// agent-notes: { ctx: "DOM UI controller connecting store state to HTML rendering", deps: ["src/todoStore.js"], state: active, last: "sato@2026-07-22" }

import { TodoStore } from './todoStore.js';

class TodoApp {
  constructor() {
    this.store = new TodoStore();
    this.currentFilter = 'all';
    this.searchQuery = '';

    // DOM Elements
    this.form = document.getElementById('todo-form');
    this.input = document.getElementById('todo-input');
    this.todoList = document.getElementById('todo-list');
    this.searchInput = document.getElementById('search-input');
    this.taskCounter = document.getElementById('task-counter');
    this.btnClearCompleted = document.getElementById('btn-clear-completed');
    this.filterBtns = document.querySelectorAll('.filter-btn');

    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Add Todo
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = this.input.value;
      if (this.store.addTodo(title)) {
        this.input.value = '';
        this.render();
      }
    });

    // Search Input
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.render();
    });

    // Filter Buttons
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Clear Completed
    this.btnClearCompleted.addEventListener('click', () => {
      this.store.clearCompleted();
      this.render();
    });

    // Delegate Toggle and Delete on List
    this.todoList.addEventListener('click', (e) => {
      const toggleTarget = e.target.closest('.custom-checkbox');
      const deleteTarget = e.target.closest('.btn-delete');
      const todoItem = e.target.closest('.todo-item');

      if (!todoItem) return;
      const id = todoItem.dataset.id;

      if (toggleTarget) {
        this.store.toggleTodo(id);
        this.render();
      } else if (deleteTarget) {
        this.store.deleteTodo(id);
        this.render();
      }
    });
  }

  getVisibleTodos() {
    let todos = this.store.getFilteredTodos(this.currentFilter);
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.trim().toLowerCase();
      todos = todos.filter(t => t.title.toLowerCase().includes(query));
    }
    return todos;
  }

  render() {
    const todos = this.getVisibleTodos();
    this.todoList.innerHTML = '';

    if (todos.length === 0) {
      this.todoList.innerHTML = `
        <li class="empty-state">
          <span class="empty-icon">✨</span>
          <p>${this.searchQuery ? 'No matching tasks found' : 'No tasks here! Add one above.'}</p>
        </li>
      `;
    } else {
      todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
          <div class="todo-left">
            <button class="custom-checkbox" aria-label="Mark task as completed">
              <svg viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <span class="todo-text">${this.escapeHTML(todo.title)}</span>
          </div>
          <button class="btn-delete" aria-label="Delete task">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            </svg>
          </button>
        `;
        this.todoList.appendChild(li);
      });
    }

    // Update Counter
    const activeCount = this.store.getFilteredTodos('active').length;
    this.taskCounter.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`;
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

// Initialize when DOM content is ready
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
