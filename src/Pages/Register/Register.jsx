import React, { useState } from "react";
import Styles from './Register.module.css';
import CarLogin from '../../assets/Images/CarLogin.png';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Services/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function Register() {

    const navigate = useNavigate();

    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    function ButtonBack() {
        navigate('/')
    }

    const RealizarRegistro = async (e) => {
        e.preventDefault();

        try {
            if (password != confirmedPassword) {
                toast.error("As senhas não coincidem", {position: "top-center"})
            }
            else {
                await createUserWithEmailAndPassword(auth, email, password);
                const user = auth.currentUser;
                console.log(user)
                if (user) {
                    await setDoc(doc(db, "Users", user.uid), {
                        email: user.email,
                        nomeCompleto: nomeCompleto
                    })
                }
                console.log("Usuario cadastrado com sucesso!!")
                toast.success("Usuário cadastrado com sucesso!!", { position: "top-center" })
                navigate('/')
            }

        } catch (error) {
            let errorMessage;
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "Este e-mail já está sendo utilizado por outra conta.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "O e-mail fornecido é inválido.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "A senha deve ter pelo menos 6 caracteres.";
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = "Operação não permitida. Por favor, entre em contato com o suporte.";
                    break;
                default:
                    errorMessage = "Ocorreu um erro ao registrar o usuário. Verifique se os campos estão preenchidos corretamente.";
            }
            console.log(errorMessage)
            toast.error(errorMessage, { position: "top-center" })
        }
    }


    return (
        <>
            <ToastContainer />
            <form onSubmit={RealizarRegistro} className={Styles.container}>
                <div className={Styles.Alinhamento}>
                    <div className={Styles.title}>
                        <h1>PARKING</h1>
                        <h1><img src={CarLogin} alt="" />LOTS</h1>
                    </div>
                    <div className={Styles.DivInputs}>
                        <div>
                            <h1>Acesse o sistema</h1>
                            <input type="text" placeholder="Nome Completo" onChange={(e) => setNomeCompleto(e.target.value)} />
                            <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                            <input type="password" placeholder="Confirme a senha" onChange={(e) => setConfirmedPassword(e.target.value)} />
                            <button className={Styles.BtnVoltar} onClick={ButtonBack}>Voltar</button>
                            <br />
                            <button className={Styles.BtnEntrar}>Criar Conta</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Register;
