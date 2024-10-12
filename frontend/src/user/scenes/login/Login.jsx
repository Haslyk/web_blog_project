import { useContext, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import './login.css'
import Loader from '../../component/loader/Loader'
import { AuthContext } from '../../context/authContext/AuthContext'
import { loginFailure, loginStart, loginSuccess } from '../../context/authContext/AuthActions'
import { Link, useNavigate } from 'react-router-dom'

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const Login = () => {
    const navigate = useNavigate()
    const loginRef = useRef()

    const gotoSignup = () => {
        loginRef.current.classList.add("sign-up-mode")
    }
    const gotoSignin = () => {
        loginRef.current.classList.remove("sign-up-mode")
    }

    const [btnDisabled, setBtnDisabled] = useState(false)
    const [resetBtnDisabled, setResetBtnDisabled] = useState(true)
    const [hideshowPassword, setHideShowPassword] = useState(false)

    const [resetPassRes, setResetPassRes] = useState({})
    const [email, setEmail] = useState("")

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    /* API CALL */
    const [loginRes, setLoginRes] = useState({})
    const [loginresReceived, setLoginResReceived] = useState()
    const login = async (user, dispatch) => {
        dispatch(loginStart())

        try {
            const res = await axios.post("http://localhost:5000/login", user)
            dispatch(loginSuccess(res.data))
            navigate('/admin')
            
        } catch (err) {
            setLoginRes({status: 401, data: "Hatalı giriş!"})
            dispatch(loginFailure())
        } finally {
            setLoginResReceived(true)
            setBtnDisabled(true)
        }
    }
    /* --------------------------------------------------------- */

    const [loginPasswordRequired, setLoginPasswordRequired] = useState(false)
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const { dispatch } = useContext(AuthContext)

    const handleLogin = async (e) => {
        e.preventDefault()

        if (loginPassword !== "") {
            setLoginPasswordRequired(false)
            setLoginResReceived(false)
            setBtnDisabled(true)
            login({ email: loginEmail, password: loginPassword }, dispatch)
        } else {
            setLoginPasswordRequired(true)
        }
    }


    // ---------------------------------------------------------------
    const handleReset = async (e) => {
        e.preventDefault();

        if (validateEmail(email)) {
            try {
                const res = await axios.post('http://localhost:5000/reset-password', { email });
                setResetPassRes({ status: res.status, data: res.data });
            } catch (err) {
                setResetPassRes({ status: err.response.status, data: err.response.data });
            } finally {
                setResetBtnDisabled(false);
            }
        } else {
            console.log('Geçersiz mail!!');
        }
    };

    useEffect(() => {
        if(validateEmail(email)) {
            setResetBtnDisabled(true)
        }
        else {
            setResetBtnDisabled(false)
        }
    }, [email]);

    useEffect(() => {
        if(validateEmail(loginEmail) && loginPassword) {
            setBtnDisabled(true)
        }
        else {
            setBtnDisabled(false)
        }
    }, [loginEmail, loginPassword]);

    

    useEffect(() => {
        console.log("btnDisabled:", btnDisabled)
    }, [btnDisabled]);


    return (
        <div className="logincontainer" ref={loginRef}>
            <Helmet>
                <title>Sign in</title>
            </Helmet>

            <div className="forms-container">
                <div className="signin-signup">
                    <form className="form sign-in-form">
                        <h2 className="title">Giriş</h2>
                        {loginresReceived === false && <Loader />}
                        {loginRes?.status === 401 && loginresReceived && (
                            <div className="error_message">{loginRes?.data}</div>
                        )}
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginEmail}
                                spellCheck="false"
                                required
                                autoComplete="on"
                                onChange={(e) => setLoginEmail(e.target.value.trim())}
                            />
                        </div>
                        <div className="input-field password">
                            <i className={`fas ${!hideshowPassword ? 'fa-eye' : 'fa-eye-slash'}`} onClick={() => setHideShowPassword(!hideshowPassword)}></i>
                            <input
                                type={!hideshowPassword ? "password" : "text"}
                                placeholder="Şifre"
                                value={loginPassword}
                                required
                                onChange={(e) => setLoginPassword(e.target.value.trim())}
                            />
                            <div className="errormsg">
                                {loginPasswordRequired ? "Fill out Password" : undefined}
                            </div>
                        </div>
                        <button
                            className="loginpage-btn"
                            type="submit"
                            onClick={handleLogin}
                            disabled={!btnDisabled}
                        >
                            Giriş
                        </button>
                    </form>

                    <form className="form sign-up-form">
                        <h2 className="title">Şifreni yenile</h2>
                        {resetPassRes.data?.error && <div className="error_message">{resetPassRes.data?.error}</div>}
                        {resetPassRes.data?.message && <div className="success_message">{resetPassRes.data?.message}</div>}
                        <div className="input-field" style={{ border: resetPassRes.data?.error ? '1px solid #FF1818' : 'none' }}>
                            <i className="fas fa-envelope"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                autoComplete="off"
                                spellCheck="false"
                                required
                                onChange={(e) => setEmail(e.target.value.trim())}
                            />
                        </div>
                        <button
                            className="loginpage-btn"
                            type="submit"
                            onClick={handleReset}
                            disabled={!resetBtnDisabled}
                        >
                            Kod Gönder
                        </button>
                    </form>
                </div>
            </div>




            <div className="panels-container">
                <div className="panel left-panel">
                    <div className='back_to_home'>
                        <Link to='/'><HomeRoundedIcon style={{ height: 30, width: 30, touchAction: true }} /></Link>
                    </div>
                    <div className="content">
                        <h3>Şifreni mi unuttun?</h3>
                        <button
                            className="loginpage-btn transparent"
                            style={{marginTop: "10%"}}
                            onClick={gotoSignup}
                        >
                            Sıfırla
                        </button>

                    </div>
                    <div></div>
                    <div></div>
                </div>




                <div className="panel right-panel">

                    <div className='back_to_home_login'>
                        <Link to='/'><HomeRoundedIcon style={{ height: 30, width: 30, touchAction: true }} /></Link>
                    </div>
                    <div className="content">

                        <h3>Giriş yapmaya hazır mısın?</h3>
                        <button
                            className="loginpage-btn transparent"
                            style={{marginTop: "10%"}}
                            onClick={gotoSignin}
                        >
                            Giriş Yap
                        </button>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default Login
