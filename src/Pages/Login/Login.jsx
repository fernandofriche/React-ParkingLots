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

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            toast.error("Erro ao realizar login: " + error.message, { position: "top-center" });
        }
    };

    
    async function RealizarLoginGoogle(e) {
        e.preventDefault();
    
        try {
            
            const result = await signInWithGoogle();
            const user = result.user;
    
            
            const userDocRef = doc(db, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);
    
            if (userDoc.exists()) {
                
                toast.success("Login com Google realizado com sucesso!", { position: "top-center" });
                navigate('/Profile');
            } else {
                
                await setDoc(userDocRef, {
                    email: user.email,
                    nomeCompleto: user.displayName || 'Nome não fornecido'
                });
    
                toast.success("Cadastro realizado com sucesso!", { position: "top-center" });
                navigate('/Profile');
            }
        } catch (error) {
            toast.error("Erro ao realizar login com Google: " + error.message, { position: "top-center" });
        }
    }
    

    
    const Registrar = () => {
        navigate('/register');
    };

    return (
        <>
            <ToastContainer />
            <form className={Styles.container} onSubmit={RealizarLogin}>
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
                                placeholder="E-mail"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className={Styles.BtnEsqueceuSenha}>Esqueceu a senha?</button>
                            <br />
                            <button type="submit" className={Styles.BtnEntrar}>Entrar</button>
                            <button
                                type="button"
                                className={Styles.BtnGoogle}
                                onClick={RealizarLoginGoogle}
                            >
                                <img src={logoGoogle} alt="Google logo" /> Entrar com Google
                            </button>

                            <p>Ainda não possui uma conta? <button className={Styles.BtnRegistrar} onClick={Registrar}>Registrar</button></p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Login;
