import React from 'react';

const TodoContext = React.createContext({
    todos: [],
    error: null,
    loading: true,
    username: '',
    isPremium: false,
    accessToken: null,
    dispatch: () => {},
});

export default TodoContext;
