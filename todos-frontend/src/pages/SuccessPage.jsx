import styles from './SuccessPage.module.css';
import successGif from '../assets/success_tick.gif';

function SuccessPage() {
    return (
        <main className={styles['sccss-cntr']}>
            <div className={styles['sccss-cntr__msg']}>
                <img src={successGif} />
                <div>Success!</div>
            </div>
        </main>
    );
}

export default SuccessPage;
