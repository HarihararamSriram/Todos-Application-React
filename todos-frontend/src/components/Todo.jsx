import { useState, useRef, useEffect } from 'react';
import CheckBox from './CheckBox';
import styles from './Todo.module.css';
import delSvg from '../assets/del.svg';

const dateToString = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let session = 'AM';
    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (hour.toString().length == 1) {
        hour = '0' + hour;
        session = 'PM';
    } else {
        hour = hour - 12;
    }
    if (minute.toString().length == 1) {
        minute = '0' + minute;
    }
    var dateTime =
        day + '-' + month + '-' + year + ' ' + hour + ':' + minute + session;
    return dateTime;
};

function Todo({
    description,
    title,
    dueTime,
    completed,
    toggleComplete,
    deleteTodo,
    editTodo,
}) {
    const todoStyle = `${styles['todo']} ${
        completed ? styles['todo-checked'] : ''
    }`;
    const formInputRef = useRef(null);
    const [editMode, setEditMode] = useState([false, null]);

    useEffect(() => {
        if (editMode[0]) formInputRef.current.focus();
    }, [editMode]);

    const editModeInputChangeHandler = (e, field) => {
        const obj = {};
        obj[field] = e.target.value;
        editTodo(obj);
    };
    const todoClickHandler = (field) => {
        setEditMode([true, field]);
    };
    return (
        <div className={todoStyle}>
            {!editMode[0] && (
                <>
                    <CheckBox
                        className={styles['todo-buttons']}
                        checked={completed}
                        toggleCheck={toggleComplete}
                    />
                    <div className={styles['todo-body']}>
                        <div>
                            <div
                                className={`${styles['todo-text']} ${styles['title']}`}
                                onClick={() => todoClickHandler('title')}
                            >
                                {title}
                            </div>
                            <div
                                className={`${styles['todo-text']} ${styles['desc']}`}
                                onClick={() => todoClickHandler('description')}
                            >
                                {description}
                            </div>
                        </div>

                        <div
                            className={styles['todo-text']}
                            onClick={() => todoClickHandler('dueTime')}
                        >
                            {dateToString(new Date(dueTime))}
                        </div>
                    </div>

                    <button
                        className={styles['todo-buttons']}
                        onClick={deleteTodo}
                    >
                        <img src={delSvg} />
                    </button>
                </>
            )}
            {editMode[0] && (
                <>
                    <button
                        className={styles['edit-done-button']}
                        type="submit"
                        form="todo-edit-form"
                    >
                        Done
                    </button>
                    <form
                        id="todo-edit-form"
                        className={styles['todo-edit-form']}
                        onSubmit={(e) => {
                            console.log('Hari');
                            e.preventDefault();
                            setEditMode([false, null]);
                        }}
                        ref={formInputRef}
                    >
                        <input
                            name={'title'}
                            value={title}
                            className={`${styles['todo-text']} ${styles['title']}`}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'title')
                            }
                        />
                        <input
                            name="description"
                            className={`${styles['todo-text']} ${styles['desc']}`}
                            value={description}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'description')
                            }
                        />
                        <input
                            name="dueTime"
                            className={`${styles['todo-text']} ${styles['desc']}`}
                            type="datetime-local"
                            value={dueTime}
                            onChange={(e) =>
                                editModeInputChangeHandler(e, 'dueTime')
                            }
                        />
                    </form>
                </>
            )}
        </div>
    );
}

export default Todo;
