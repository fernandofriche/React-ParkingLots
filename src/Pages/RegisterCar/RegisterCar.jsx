import React from "react";
import Styles from './RegisterCar.module.css'
import Logo from '../../assets/Images/Logo2.png'
import CircleUser from '../../assets/Images/CircleUser.png'


function RegisterCar() {
    return (
        <header className={Styles.Cabecalho}>
            <ul>
                <li className={Styles.Space2}></li>
                <a href=""><img src={Logo} alt="" srcset="" /></a>
                <a href=""><li>Reservas</li></a>
                <a href=""><li>Seu carro</li></a>
                <a href=""><li>Estacionamentos</li></a>
                <a href=""><li>Parceiros</li></a>
                <a href=""><li>Meus cartões</li></a>
                <li  className={Styles.Space}></li>
                <a href=""><img src={CircleUser} alt="" srcset="" /></a>
            </ul>
        </header>
    )
}
export default RegisterCar;