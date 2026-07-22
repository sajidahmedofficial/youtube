// agent-notes: { ctx: "core TodoStore state management and storage persistence", deps: [], state: active, last: "sato@2026-07-22" }

export class TodoStore {
  /**
   * @param {Storage} [storage] - LocalStorage implementation or mock
   * @param {string} [storageKey] - Storage key
   */
  constructor(storage = typeof localStorage !== 'undefined' ? localStorage : null, storageKey = 'todo_app_tasks') {
    this.storage = storage;
    this.storageKey = storageKey;
    this.todos = this._loadFromStorage();
  }

  _loadFromStorage() {
    if (!this.storage) return [];
    try {
      const data = this.storage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  _saveToStorage() {
    if (!this.storage) return;
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(this.todos));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  }

  /**
   * Get all todo items
   * @returns {Array<{id: string, title: string, completed: boolean, createdAt: string}>}
   */
  getTodos() {
    return [...this.todos];
  }

  /**
   * Add a new todo item
   * @param {string} title
   * @returns {Object|null}
   */
  addTodo(title) {
    const trimmedTitle = (title || '').trim();
    if (!trimmedTitle) return null;

    const newTodo = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.unshift(newTodo);
    this._saveToStorage();
    return newTodo;
  }

  /**
   * Toggle a todo completed status
   * @param {string} id
   */
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this._saveToStorage();
    }
  }

  /**
   * Delete a todo item
   * @param {string} id
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this._saveToStorage();
  }

  /**
   * Clear all completed todo items
   */
  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this._saveToStorage();
  }

  /**
   * Filter todos by status
   * @param {'all'|'active'|'completed'} filter
   * @returns {Array}
   */
  getFilteredTodos(filter = 'all') {
    if (filter === 'active') {
      return this.todos.filter(t => !t.completed);
    }
    if (filter === 'completed') {
      return this.todos.filter(t => t.completed);
    }
    return this.getTodos();
  }

  /**
   * Search todos by title
   * @param {string} query
   * @returns {Array}
   */
  searchTodos(query = '') {
    const q = query.trim().toLowerCase();
    if (!q) return this.getTodos();
    return this.todos.filter(t => t.title.toLowerCase().includes(q));
  }
}
