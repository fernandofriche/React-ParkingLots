import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from './HomePage.module.css';
import Logo from '../../assets/Images/Logo2.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import AeroportoImage from '../../assets/Cards/Aeroporto.svg';


function HomePage() {
    const [parkingLots, setParkingLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/parkinglots.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados.');
                }
                return response.json();
            })
            .then(data => {
                setParkingLots(data.parkingLots);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (id) => {
        navigate(`/detalhes/${id}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra os estacionamentos com base no termo de pesquisa
    const filteredParkingLots = parkingLots.filter(lot =>
        lot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            <main className={Styles.MainContent}>
                <h1>Estacionamentos Disponíveis</h1>
                
                <div className={Styles.SearchBarContainer}>
                    <input 
                        type="text" 
                        placeholder="Buscar estacionamento..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={Styles.SearchBar}
                    />
                </div>
                
                {loading && <p>Carregando estacionamentos...</p>}
                {error && <p>Error: {error}</p>}
                
                <div className={Styles.CardContainer}>
                    {filteredParkingLots.map(lot => (
                        <div 
                            key={lot.id} 
                            className={Styles.Card} 
                            onClick={() => handleCardClick(lot.id)}
                        >
                            <img src={AeroportoImage} alt="Parking Lot" className={Styles.CardImage} />
                            <h2>{lot.name}</h2>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default HomePage;