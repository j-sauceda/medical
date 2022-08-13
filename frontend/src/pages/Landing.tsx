import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
    return (
        <div className="App p-3 text-center">
            <div className="p-3">
                Appointments booking and management for patients and doctors
            </div>
            <br />
            <div className="p-3">
                <Link to="/signup" className="btn btn-primary">
                    Register a new account
                </Link>
            </div>
            <br />
            <div className="p-3">
                <Link to="/login" className="btn btn-primary">
                    Log into your account
                </Link>
            </div>
        </div>
    )
}

export default Landing;
