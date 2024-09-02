import React, { useState } from "react";
import Styles from './ResetPassword.module.css';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import CarLogin from '../../assets/Images/CarLogin.png';
import { auth } from "../../Services/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const ResetSenha = async (e) => {
        e.preventDefault();
        try {
            if (!email) {
                toast.error("Por favor, insira um e-mail.");
                return;
            }

            await sendPasswordResetEmail(auth, email);
            toast.success("E-mail de redefinição de senha enviado!");
            setEmail(""); // Limpar o campo de email após o envio
        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = "O e-mail fornecido é inválido.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "Nenhum usuário encontrado com este e-mail.";
                    break;
                default:
                    errorMessage = "Erro ao enviar e-mail: " + error.message;
            }
            toast.error(errorMessage);
        }
    };

    function VoltarLogin() {
        navigate('/');
    }

    return (
        <>
            <ToastContainer />
            <form className={Styles.container} onSubmit={ResetSenha}>
                <div className={Styles.Alinhamento}>
                    <div className={Styles.Title}>
                        <h1>PARKING</h1>
                        <h1><img src={CarLogin} alt="Car" />LOTS</h1>
                    </div>
                    <div className={Styles.ResetPassword}>
                        <h1>Redefinir senha</h1>
                        <p>Insira seu e-mail e nós iremos te enviar<br />todas instruções para resetar a sua senha</p>
                        <div className={Styles.Reset}>
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit" className={Styles.Redefinir}>
                                Enviar Link de Redefinição
                            </button>
                        </div>
                        <button className={Styles.BtnVoltar} onClick={VoltarLogin}>Voltar</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ResetPassword;
