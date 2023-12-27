function CheckBox({ className, checked, toggleCheck }) {
    return (
        <button className={className} onClick={toggleCheck}>
            {checked && '✅'}
            {!checked && '🟦'}
        </button>
    );
}

export default CheckBox;
