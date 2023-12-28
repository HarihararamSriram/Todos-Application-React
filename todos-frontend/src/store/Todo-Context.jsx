import React from 'react';

const TodoContext = React.createContext({
    todos: [],
    error: null,
    loading: true,
    dispatch: () => {},
});

export default TodoContext;
