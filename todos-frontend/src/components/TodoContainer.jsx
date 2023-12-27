import Todo from './Todo';
import TodoForm from './TodoForm';
import styles from './TodoContainer.module.css';
import { useState } from 'react';

function TodoContainer() {
    const [todos, setTodos] = useState([]);

    const addTodo = (todo) => {
        setTodos((prev) => [...prev, todo]);
    };

    const deleteTodo = (removeIndex) => {
        setTodos((prev) => prev.filter((todo, index) => index !== removeIndex));
    };

    const toggleComplete = (index) => {
        setTodos((prev) => {
            const newTodos = [...prev];

            newTodos[index].completed = !newTodos[index].completed;
            return newTodos;
        });
    };

    const editTodo = (index, changes) => {
        setTodos((prev) => {
            const newTodos = [...prev];
            for (const key in changes) {
                newTodos[index][key] = changes[key];
            }
            return newTodos;
        });
    };

    return (
        <>
            <TodoForm addTodo={addTodo} />
            <div className={styles['todo-list-container']}>
                {todos.map((todo, index) => {
                    return (
                        <Todo
                            key={todo['id']}
                            toggleComplete={() => toggleComplete(index)}
                            editTodo={(changes) => editTodo(index, changes)}
                            deleteTodo={() => deleteTodo(index)}
                            {...todo}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default TodoContainer;
