import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {useSelector, useStore} from "react-redux";
import TodoItem from "./components/TodoItem";
import TodoList from "./components/TodoList";
import TodoApp from "./components/TodoApp";


function App() {
  return (
    <div className="App">
        <TodoApp />
    </div>
  );
}

export default App;
