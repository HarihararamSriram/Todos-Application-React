function CheckBox({ checked, toggleCheck }) {
    return (
        <button onClick={toggleCheck}>
            {checked && '✅'}
            {!checked && '🟦'}
        </button>
    );
}

export default CheckBox;
