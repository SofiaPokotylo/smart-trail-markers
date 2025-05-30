import React from 'react'
import Hero from '../Components/Hero'
import Banner from '../Components/Banner';
import { Link } from 'react-router-dom';
import {FaRegMeh} from 'react-icons/fa';

export default function Error() {
    return (
        <>
        <Hero hero="routesError" />
        <Banner title="ERROR 404 NOT FOUND" subtitle="You are lost !! ITs dark everywhere">
                <FaRegMeh className="lost"></FaRegMeh>
                <Link to="/" className="btn btn-warning">
                      RETURN HOME
                </Link>
        </Banner>
        </>
    )
}
