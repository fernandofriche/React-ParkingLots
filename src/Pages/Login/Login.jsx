import React, { useState } from "react";
import Styles from './Login.module.css';
import CarLogin from '../../assets/Images/CarLogin.png';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../Services/firebaseConfig";
import logoGoogle from '../../assets/Images/logoGoogle.png';
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Services/firebaseConfig";
import EyesFull from '../../assets/Images/eye-fill.svg';
import { duration } from "@mui/material";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    const navigate = useNavigate();

    const RealizarLogin = async (e) => {
        e.preventDefault();

        try {
            if (password === "" || email === "") {
                toast.error("Preencha os campos abaixo corretamente", { position: "top-center" });
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login realizado com sucesso!", { position: "top-center" });
            navigate('/Profile');
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = "Senha incorreta. Por favor, tente novamente.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "E-mail não cadastrado. Por favor, realize o cadastro primeiro.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "O e-mail fornecido é inválido.";
                    break;
                case 'auth/invalid-credential':
                    errorMessage = "Credenciais inválidas fornecidas. Verifique suas informações.";
                    break;
                default:
                    errorMessage = "Erro ao realizar login: " + error.message;
            }
            toast.error(errorMessage, { position: "top-center" });
        }
    };

    async function RealizarLoginGoogle(e) {
        e.preventDefault();

        try {
            const result = await signInWithGoogle();
            const user = result.user;

            if (!user) {
                throw new Error("Erro ao realizar login com Google.");
            }

            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                toast.success("Login com Google realizado com sucesso!", { position: "top-center" });
                navigate('/Profile');
            } else {
                await user.delete();
                toast.error("Este e-mail não está registrado. Realize o cadastro primeiro.", { position: "top-center",
                    autoClose: 1000
                 });
            }
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = "O login com Google foi cancelado.";
                    break;
                case 'auth/invalid-credential':
                    errorMessage = "Credenciais inválidas fornecidas ao tentar login com Google.";
                    break;
                default:
                    errorMessage = "Erro ao realizar login com Google";
            }
            toast.error(errorMessage, { position: "top-center" });
        }
    }

    function RedefiniSenha() {
        navigate('/ResetPassword');
    }

    const Registrar = () => {
        navigate('/register');
    };

    return (
        <>
            <ToastContainer />
            <form className={Styles.container}>
                <div className={Styles.Alinhamento}>
                    <div className={Styles.title}>
                        <h1>PARKING</h1>
                        <h1><img src={CarLogin} alt="" />LOTS</h1>
                    </div>
                    <div className={Styles.DivInputs}>
                        <div>
                            <h1>Acesse o sistema</h1>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                
                            />
                            <div className={Styles.PasswordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    
                                />
                                <img
                                    src={EyesFull}
                                    alt="Mostrar senha"
                                    className={Styles.PasswordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                            <button className={Styles.BtnEsqueceuSenha} onClick={RedefiniSenha}>Esqueceu a senha?</button>
                            <br />
                            <button type="submit" onClick={RealizarLogin} className={Styles.BtnEntrar}>Entrar</button>
                            <div className={Styles.DivGoogle}>

                                <button
                                    type="button"
                                    className={Styles.BtnGoogle}
                                    onClick={RealizarLoginGoogle}
                                >
                                    <img src={logoGoogle} alt="Google logo" /> Entrar com Google
                                </button>
                            </div>


                            <p>Ainda não possui uma conta? <button className={Styles.BtnRegistrar} onClick={Registrar}>Registrar</button></p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Login;
