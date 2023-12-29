import { useState } from 'react';
import styles from './TodoForm.module.css';
import picUplSvg from '../assets/add_photo.svg';

const DEFAULT_TODO = {
    description: '',
    title: '',
    dueTime: '',
    completed: false,
};

function TodoForm({ addTodo }) {
    const [todo, setTodo] = useState(DEFAULT_TODO);
    const submitHandler = (e) => {
        e.preventDefault();
        for (const field in todo) {
            const val = todo[field];
            if (typeof val === 'string' && val.trim().length === 0) return -1;
        }
        addTodo(todo);
        setTodo(DEFAULT_TODO);
    };
    const changeHandler = (e, field) => {
        setTodo((prev) => {
            const newTodo = { ...prev };
            newTodo[field] = e.target.value;
            return newTodo;
        });
    };
    return (
        <form onSubmit={submitHandler} className={styles['todo-form']}>
            <div className={styles['todo-text-container']}>
                <button className={styles['todo-button']} type="submit">
                    +
                </button>
                <div className={styles['two-rows-title-desc-cntr']}>
                    <input
                        value={todo['title']}
                        onChange={(e) => changeHandler(e, 'title')}
                        placeholder="Title"
                        className={`${styles['todo-text']} ${styles['title']}`}
                    />
                    <input
                        placeholder="Description"
                        className={`${styles['todo-text']} ${styles['desc']}`}
                        value={todo['description']}
                        onChange={(e) => changeHandler(e, 'description')}
                    />
                </div>
                <div>
                    <input type="file" />
                    <img src={picUplSvg} />
                    <div
                        className={styles['input-container']}
                        id="date-picker-container"
                    >
                        <label htmlFor="date-from">Due</label>
                        <input
                            value={todo['dueTime']}
                            onChange={(e) => changeHandler(e, 'dueTime')}
                            type="datetime-local"
                            id="date-checkin"
                            className={styles['date-field']}
                            name="date-from"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default TodoForm;
