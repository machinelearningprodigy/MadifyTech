// frontend/src/App.js
import React from 'react';
import TodoList from './components/TodoList';

// Import Tailwind CSS
import './index.css';

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;