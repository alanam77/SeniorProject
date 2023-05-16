import { useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './styles.module.css';

const Signup = () => {
  const [data, setData] = useState({
    email: "@utrgv.edu",
    password: ""
  })
  const [error, setError] = useState("")

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = "http://localhost:8080/api/auth"
      const { data: res } = await axios.post(url, data)
      localStorage.setItem("token", res.data)
      window.location = "/"
    } catch (error) {
      if (error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message)
      }
    }
  }

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <div>
              <input
                data-testid="email"
                type="email"
                placeholder='UTRGV Email'
                name='email'
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
            </div>
            <div>
              <input
                data-testid="password"
                type="password"
                placeholder='Password'
                name='password'
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
            <button data-testid="sign-in-btn" type='submit' className={styles.green_btn}>
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here?</h1>
          <Link to="/signup">
            <button data-testid="sign-up-btn" type='button' className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>

  );
}

export default Signup;
