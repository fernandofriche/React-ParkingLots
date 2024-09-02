import React, { useState, useEffect } from 'react';
import Styles from './Profile.module.css';
import { auth, db } from '../../Services/firebaseConfig';
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUpdatePassword } from 'react-firebase-hooks/auth';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

function Profile() {
    const [detalhesUsuario, setdetalhesUsuario] = useState(null);
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [updatePassword, updating, error] = useUpdatePassword(auth);
    const navigate = useNavigate(); // Navegação para redirecionamento

    async function DeletarConta() {
        try {
            const user = auth.currentUser;

            if (user) {
                // Deletar documento do usuário no Firestore
                const userDocRef = doc(db, 'Users', user.uid);
                await deleteDoc(userDocRef);

                // Deletar a conta de autenticação
                await user.delete();

                toast.success('Conta deletada com sucesso!', { position: "top-center" });
                navigate('/'); // Redireciona para a página de login
            }
        } catch (error) {
            console.error('Erro ao deletar conta: ', error);
            toast.error('Erro ao deletar a conta. Tente novamente.', { position: "top-center" });
        }
    }

    function teste() {
        navigate('/HomePage')
    }

    const dataBaseUsuario = async () => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setdetalhesUsuario(docSnap.data());
                console.log(docSnap.data());
            } else {
                console.log("O documento do usuário não foi encontrado!");
            }
        }
    };

    useEffect(() => {
        dataBaseUsuario();
    }, []);

    const handleUpdatePassword = async () => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');
            if (password == currentPassword) {
                toast.error("Essa senha já está em uso!", {position: "top-center"})
            } else {

                // Reautenticar o usuário
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);

                // Atualizar a senha
                const success = await updatePassword(password);
                if (success) {
                    toast.success('Senha atualizada com sucesso!', { position: "top-center" });
                }
            }
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                toast.error('Por favor, faça login novamente para atualizar sua senha.', { position: "top-center" });
            } else {
                toast.error('Erro ao atualizar a senha: ' + error.message, { position: "top-center" });
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div className={Styles.nome}>
                {detalhesUsuario ? (
                    <>
                        <h3>Olá {detalhesUsuario.nomeCompleto}</h3>
                    </>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>

            <div>
                <button onClick={DeletarConta}>Deletar</button>
            </div>

            {error && (
                <div>
                    <p>Error: {error.message}</p>
                </div>
            )}

            {updating && <p>Updating...</p>}

            <div className={Styles.updatePasswordContainer}>
                <h3>Atualizar Senha</h3>
                <input
                    type="password"
                    placeholder="Senha Atual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                />
                <input
                    type="password"
                    placeholder="Nova Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />
                <button onClick={handleUpdatePassword}>
                    Atualizar Senha
                </button>
                <button onClick={teste}>teste</button>
            </div>
        </>
    );
}

export default Profile;
