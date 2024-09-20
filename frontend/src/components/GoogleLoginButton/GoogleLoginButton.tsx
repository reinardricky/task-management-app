import styles from "./GoogleLoginButton.module.scss";

const GoogleLoginButton = () => {
  const handleLoginGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };
  return (
    <button className={styles.GoogleLoginButton} onClick={handleLoginGoogle}>
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
