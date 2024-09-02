import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from './HomePage.module.css';
import Logo from '../../assets/Images/Logo2.png';
import CircleUser from '../../assets/Images/CircleUser.png';
import AeroportoImage from '../../assets/Cards/Aeroporto.svg';
import CentralImage from '../../assets/Cards/Central.svg';
import ShoppingImage from '../../assets/Cards/Shopping.svg';
import PraiaImage from '../../assets/Cards/Praia.svg';
import HospitalImage from '../../assets/Cards/Hospital.svg';
import EstadioImage from '../../assets/Cards/Estadio.svg';
import UniversidadeImage from '../../assets/Cards/Universidade.svg';
import BairroImage from '../../assets/Cards/Bairro.svg';
import MercadoImage from '../../assets/Cards/Mercado.svg';
import ParqueImage from '../../assets/Cards/Parque.svg';
import EmpresarialImage from '../../assets/Cards/Empresarial.svg';
import HotelImage from '../../assets/Cards/Hotel.svg';
import EventosImage from '../../assets/Cards/Eventos.svg';
import PortoImage from '../../assets/Cards/Porto.svg';
import NorteImage from '../../assets/Cards/Norte.svg';



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

    // Crie um mapeamento de ID para imagens
    const imageMap = {
        1: CentralImage,
        2: ShoppingImage,
        3: AeroportoImage,
        4: PraiaImage,
        5: HospitalImage,
        6: EstadioImage,
        7: UniversidadeImage,
        8: BairroImage,
        9: MercadoImage,
        10: ParqueImage,
        11: EmpresarialImage,
        12: HotelImage,
        13: EventosImage,
        14: PortoImage,
        15: NorteImage
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
                            <img src={imageMap[lot.id]} alt={lot.name} className={Styles.CardImage} />
                            <h2>{lot.name}</h2>
                            <button className={Styles.BtnReserar}>Reservar</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default HomePage;
