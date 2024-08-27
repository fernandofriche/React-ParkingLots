import React, { useState, useEffect } from 'react';
import Styles from './Profile.module.css';
import { auth, db } from '../../Services/firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [detalhesUsuario, setdetalhesUsuario] = useState(null);
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
        </>
    );
}

export default Profile;
