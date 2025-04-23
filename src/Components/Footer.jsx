import React from 'react'
import { FaFacebookSquare,FaLinkedin } from 'react-icons/fa';
import {IoLogoYoutube} from 'react-icons/io';
import { AiFillInstagram } from 'react-icons/ai';
import { Container, Col, Row } from 'react-bootstrap'

function Footer() {
    return (
        <footer className="border-top bg-white mt-5">
            <div className="py-3 mx-5 d-flex flex-row flex-wrap text-center align-items-center justify-content-around border-bottom">
                <div>
                    <h5>Завантажте Додаток</h5>
                    <div>
                        <img width="130px" src="https://z.nooncdn.com/s/app/com/common/images/logos/app-store.svg" alt="" />
                        <img width="130px" src="https://z.nooncdn.com/s/app/com/common/images/logos/google-play.svg" alt="" />
                    </div>
                </div>
                <div>
                    <h5>Наші Соцмережі</h5>
                    <div>
                        <a href="https://web.facebook.com/">
                                 <FaFacebookSquare className="connect text-dark" /></a>
                             <a href="https://www.linkedin.com/">
                                 <FaLinkedin className="connect text-dark" /></a>
                             <a href="https://www.instagram.com/">
                                 <AiFillInstagram className="connect text-dark" /></a>
                             <a href="https://www.youtube.com/">
                                <IoLogoYoutube className="connect text-dark" /></a>
                    </div>
                </div>
            </div>
            <div className="bg-dark text-white d-flex d-row justify-content-around align-items-center flex-wrap">
                <div>
                    <p className="text-center pt-3">&copy; 2024 Smart Trail Markers App</p>
                </div>
                <div>
                    <ul className="list-unstyled d-flex d-row flex-wrap">
                        <li className="mx-2 mt-2">Carrers</li>
                        <li className="mx-2 mt-2">Term of Use</li>
                        <li className="mx-2 mt-2">Privacy Policy</li>
                        <li className="mx-2 mt-2">Contact</li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer