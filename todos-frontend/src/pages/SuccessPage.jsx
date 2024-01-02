import styles from './SuccessPage.module.css';
import successGif from '../assets/success.gif';

function SuccessPage() {
    return (
        <main className={styles['sccss-cntr']}>
            <div className={styles['sccss-cntr__msg']}>
                <img src={successGif} />
                <caption>Success!</caption>
            </div>
        </main>
    );
}

export default SuccessPage;
