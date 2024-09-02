import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Styles from './Detalhes.module.css';
import Logo from '../../assets/Images/Logo2.png';
import CircleUser from '../../assets/Images/CircleUser.png';

function Detalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [parkingLot, setParkingLot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nome, setNome] = useState("");
    const [cidade, setCidade] = useState("");
    const [telefone, setTelefone] = useState("");
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [entrada, setEntrada] = useState("");
    const [saida, setSaida] = useState("");

    useEffect(() => {
        fetch('/parkinglots.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados.');
                }
                return response.json();
            })
            .then(data => {
                const selectedLot = data.parkingLots.find(lot => lot.id === parseInt(id));
                setParkingLot(selectedLot);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const calcularValorTotal = () => {
        const horaEntrada = new Date(`01/01/2020 ${entrada}`);
        const horaSaida = new Date(`01/01/2020 ${saida}`);
        const diferencaHoras = (horaSaida - horaEntrada) / (1000 * 60 * 60);
        return diferencaHoras * (parkingLot ? parkingLot.hourlyRate : 0);
    };

    const handleConfirmar = (e) => {
        e.preventDefault();

        const reserva = {
            id: Date.now(), // Usando o timestamp como ID único
            placa,
            local: parkingLot.name,
            entrada,
            saida
        };

        const reservasExistentes = JSON.parse(localStorage.getItem('reservas')) || [];
        localStorage.setItem('reservas', JSON.stringify([...reservasExistentes, reserva]));

        navigate('/reservas'); // Redirecionar para a página de reservas após confirmar
    };

    return (
        <div>
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

            <main className={Styles.DetalhesMainContent}>
                {loading && <p>Carregando detalhes...</p>}
                {error && <p>Error: {error}</p>}

                {parkingLot && (
                    <div className={Styles.DetalhesContainer}>
                        <h2>{parkingLot.name}</h2>
                        <p>{parkingLot.description}</p>
                        <hr />
                        <p>Valor da hora: R$ {parkingLot.hourlyRate.toFixed(2)}</p>

                        <form className={Styles.Form} onSubmit={handleConfirmar}>
                            <div className={Styles.InputGroup}>
                                <label htmlFor="nome">Nome Completo:</label>
                                <input type="text" id="nome" name="nome" required onChange={(e) => setNome(e.target.value)} />
                            </div>

                            <div className={Styles.InputGroupHorizontal}>
                                <div>
                                    <label htmlFor="cidade">Cidade:</label>
                                    <input type="text" id="cidade" name="cidade" required onChange={(e) => setCidade(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="telefone">Telefone:</label>
                                    <input type="text" id="telefone" name="telefone" required onChange={(e) => setTelefone(e.target.value)} />
                                </div>
                            </div>

                            <div className={Styles.InputGroupHorizontal}>
                                <div>
                                    <label htmlFor="modelo">Modelo do Veículo:</label>
                                    <input type="text" id="modelo" name="modelo" required onChange={(e) => setModelo(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="placa">Placa do Veículo:</label>
                                    <input type="text" id="placa" name="placa" required onChange={(e) => setPlaca(e.target.value)} />
                                </div>
                            </div>

                            <div className={Styles.InputGroupHorizontal}>
                                <div>
                                    <label htmlFor="entrada">Entrada:</label>
                                    <input type="time" id="entrada" name="entrada" required onChange={(e) => setEntrada(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="saida">Saída:</label>
                                    <input type="time" id="saida" name="saida" required onChange={(e) => setSaida(e.target.value)} />
                                </div>
                            </div>

                            <p>Valor Total: R$ {calcularValorTotal().toFixed(2)}</p>

                            <button type="submit">Confirmar</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Detalhes;
