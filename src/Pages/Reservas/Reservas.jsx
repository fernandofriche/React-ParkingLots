import React, { useState, useEffect } from 'react';
import Styles from './Reservas.module.css';
import Logo from '../../assets/Images/Logo2.png'; // Certifique-se de ajustar o caminho corretamente
import CircleUser from '../../assets/Images/CircleUser.png'; // Certifique-se de ajustar o caminho corretamente

function Reservas() {
    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        const reservasSalvas = JSON.parse(localStorage.getItem('reservas')) || [];
        setReservas(reservasSalvas);
    }, []);

    return (
        <div className={Styles.ReservasContainer}>
            <header className={Styles.Cabecalho}>
                <ul>
                    <li>
                        <a href="/">
                            <img className={Styles.Logo} src={Logo} alt="Logo" />
                        </a>
                    </li>
                    <li><a href="#estacionamentos">Estacionamentos</a></li>
                    <li><a href="#reservas">Reservas</a></li>
                    <li><a href="#seu-carro">Seu Carro</a></li>
                    <li><a href="#parceiros">Parceiros</a></li>
                    <li>
                        <a href="#usuario">
                            <img src={CircleUser} alt="User" className={Styles.UserIcon} />
                        </a>
                    </li>
                </ul>
            </header>
            
            <h1>Suas Reservas</h1>

            {reservas.length > 0 ? (
                <table className={Styles.ReservasTable}>
                    <thead>
                        <tr>
                            <th>TICKET ID</th>
                            <th>PLACA DO VEÍCULO</th>
                            <th>LOCAL</th>
                            <th>ENTRADA</th>
                            <th>SAÍDA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((reserva) => (
                            <tr key={reserva.id}>
                                <td>{reserva.id}</td>
                                <td>{reserva.placa}</td>
                                <td>{reserva.local}</td>
                                <td>{reserva.entrada}</td>
                                <td>{reserva.saida}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={Styles.NoReservas}>
                    <p>*Não há necessidade de imprimir nada! Todas as suas reservas estão aqui.*</p>
                    <p>*Os estacionamentos modernos são equipados com reconhecimento automático de placas (ALPR).*</p>
                </div>
            )}
        </div>
    );
}

export default Reservas;
