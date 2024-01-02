import { useEffect, useReducer } from 'react';
import { useQuery } from '@apollo/client';
import TodoContext from './Todo-Context';
import { ALL_TODO_QUERY } from './TodoQueries';
import { useKeycloak } from '@react-keycloak/web';

const [INIT_LOAD, ADD, DEL, EDIT, TOGGLE_COMPLETE, ERROR, LOADING] = [
    0, 1, 2, 3, 4, 5, 6,
];

const todoReducer = (state, action) => {
    switch (action.type) {
        case INIT_LOAD: {
            return {
                ...state,
                todos: action.todos,
                error: null,
                loading: false,
            };
        }
        case ADD: {
            let newTodos = [...state.todos];
            const index = newTodos.findIndex(
                (todo) => todo.dueTime < action.newTodo.dueTime,
            );
            newTodos.splice(index, 0, action.newTodo);
            return { ...state, todos: newTodos };
        }
        case DEL: {
            let newTodos = [...state.todos];
            return {
                ...state,
                todos: newTodos.filter(
                    (todo, index) => index !== action.removeIndex,
                ),
            };
        }
        case EDIT: {
            let newTodos = [...state.todos];
            let newTodo = { ...newTodos[action.editIndex] };
            for (const key in action.changes) {
                newTodo[key] = action.changes[key];
            }
            newTodos[action.editIndex] = newTodo;
            return { ...state, todos: newTodos };
        }
        case TOGGLE_COMPLETE: {
            let newTodos = [...state.todos];
            let newTodo = { ...newTodos[action.editIndex] };
            newTodo.completed = !newTodo.completed;
            newTodos[action.editIndex] = newTodo;
            return { ...state, todos: newTodos };
        }

        case ERROR: {
            return { ...state, error: action.message, loading: false };
        }

        case LOADING: {
            return { ...state, loading: action.loading };
        }
    }
};

function TodoProvider({ children, username }) {
    const { loading, error, data } = useQuery(ALL_TODO_QUERY, {
        variables: { username: username },
    });
    const { keycloak } = useKeycloak();

    const [state, dispatch] = useReducer(todoReducer, {
        todos: [],
        error: null,
        loading: true,
        username: username,
    });

    useEffect(() => {
        if (loading) dispatch({ type: LOADING, loading: true });
        else {
            if (data) {
                if (data.error) {
                    // An error can be returned by the graphql endpoint when (1) Access Token is old (2) The access token is invalid and wasn't introspected successfully.
                    //(1)
                    if (data.isTokenActive) {
                        // Code for refreshing the token
                        (async () => await keycloak.updateToken())();
                    } else {
                        //(2)
                        dispatch({ type: ERROR, message: data.error });
                    }
                } else {
                    dispatch({ type: INIT_LOAD, todos: [...data.todos.data] });
                    dispatch({ type: LOADING, loading: false });
                }
            }
        }
        if (error) dispatch({ type: ERROR, message: error });
    }, [loading, error]);

    return (
        <TodoContext.Provider
            value={{
                ...state,
                dispatch: dispatch,
            }}
        >
            {children}
        </TodoContext.Provider>
    );
}

export default TodoProvider;
