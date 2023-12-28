import './App.css';
import TodoContainer from './components/TodoContainer';
import TodoProvider from './store/TodoProvider';

function App() {
    return (
        <main>
            <h1 style={{ textAlign: 'center' }}>Todos</h1>
            <TodoProvider>
                <TodoContainer />
            </TodoProvider>
        </main>
    );
}

export default App;
