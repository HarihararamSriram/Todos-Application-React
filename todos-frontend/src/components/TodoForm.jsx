import { useContext, useRef, useState } from 'react';
import styles from './TodoForm.module.css';
import picUplSvg from '../assets/add_photo.svg';
import TodoContext from '../store/Todo-Context';

function TodoForm({ todo, setTodo, submitTodoForm }) {
    const todoCtx = useContext(TodoContext);
    const { isPremium } = todoCtx;
    const uploadedImage = todo['image'];
    const setUploadedImage =
        isPremium &&
        ((newImage) => {
            setTodo((prev) => {
                return { ...prev, image: newImage };
            });
        });
    const imageInputRef = useRef(null);

    const imageInputChangeHandler =
        isPremium &&
        ((e) => {
            const file = e.target.files[0];
            if (file) {
                setUploadedImage(file);
                console.log(`Uploaded file ${file.name}`);
            }
        });
    const fieldChangeHandler = (e, field) => {
        setTodo((prev) => {
            const newTodo = { ...prev };
            newTodo[field] = e.target.value;
            return newTodo;
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();

        for (const field in todo) {
            const val = todo[field];
            //? `uploadedImage` is 'image' field in 'todo'
            if (field == 'image' && !val) return -1;

            if (typeof val === 'string' && val.trim().length === 0) return -1;
        }
        //* Setting the todoFormData state in parent, with form data. We will reset the form, after successful submission in parent
        submitTodoForm();
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
                        onChange={(e) => fieldChangeHandler(e, 'title')}
                        placeholder="Title"
                        className={`${styles['todo-text']} ${styles['title']}`}
                    />
                    <input
                        placeholder="Description"
                        className={`${styles['todo-text']} ${styles['desc']}`}
                        value={todo['description']}
                        onChange={(e) => fieldChangeHandler(e, 'description')}
                    />
                </div>
                <div className={styles['left-inpt-cntr']}>
                    {isPremium && (
                        <div className={styles['left-inpt-cntr__img-ctr']}>
                            <input
                                onChange={imageInputChangeHandler}
                                accept="image/*"
                                type="file"
                                ref={imageInputRef}
                            />
                            <button
                                onClick={() => imageInputRef.current.click()}
                                className={styles['img-upld-btn']}
                            >
                                <img src={picUplSvg} />
                            </button>
                            {uploadedImage && <div>{uploadedImage.name}</div>}
                        </div>
                    )}
                    <div
                        className={styles['date-picker-container']}
                        id="date-picker-container"
                    >
                        <label htmlFor="date-from">Due</label>
                        <input
                            value={todo['dueTime']}
                            onChange={(e) => fieldChangeHandler(e, 'dueTime')}
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
