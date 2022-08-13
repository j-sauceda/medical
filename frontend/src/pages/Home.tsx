import React, {useEffect, useState} from "react";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import UserNavBar from "../components/UserNavBar";
import UpdateUser from "../components/UpdateUser";
import NewAppointment from "../components/NewAppointment";
import UpcomingAppointments from "../components/UpcomingAppointments";
import PastAppointments from "../components/PastAppointments";
import { Alert, Button, ButtonGroup } from "react-bootstrap";
import DoctorPastAppointments from "../components/DoctorPastAppointments";
import TodayAgenda from "../components/TodayAgenda";
import PatientHistory from "../components/PatientHistory";

const Home: React.FC = () => {
    const [action, setAction] = useState<number>(0);
    const [msg, setMsg] = useState<string>("");
    const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);

    const ME_QUERY = gql`
        query {
            me {
                pk
                username
                firstName
                lastName
                dob
                phone
                address
                isDoctor
            } 
        }`

    useEffect(() => {
        refetch();
    });

    const { loading, error, data, refetch } = useQuery(ME_QUERY);

    if (loading) return <div className="p-3 text-center"><p>Loading Home...</p></div>
    if (error) return <div className="p-3 text-center"><p>{error.message}</p></div>

    let id: number = 0
    if (data.me === null) {
        return (
            <div className="p-3 text-center">
                <h4>Your session has expired</h4>
                <Link to="/login">Please, log in again</Link>
            </div>
        )
    }
    else if (data.me.pk !== null) {
        id = data.me.pk;
    }

    // if user profile needs updating, render UpdateUser
    if (data.me.firstName === "" || data.me.lastName === "" || !data.me.dob || data.me.phone === "+504 1234 5678" || !data.me.address || data.me.address === "") {
        return (
            <div className="p-3 text-center">
                <UpdateUser id={id} setGlobalMsg={setMsg} setViewGlobalMsg={setAlertIsOpen} />
            </div>
        )
    }

    // render NavBar & User area for doctors or patients depending on the value of data.me.isDoctor
    return (
        <div className="p-3">
            <UserNavBar setAction={setAction} isDoctor={data.me.isDoctor} />
            {
                alertIsOpen && (
                <div className="mb-3 text-center">
                    <Alert variant="info" onClose={() => { setMsg(""); setAlertIsOpen(false); }} dismissible>
                        <p> {msg} </p>
                    </Alert>
                    <br />
                </div>)
            }

            { action === 0 && (
                <div className="p-3 text-center">
                    <h4>Welcome, {data.me.username}!</h4>
                    <h5>What would you like to do today?</h5>
                    {
                        !data.me.isDoctor ? (
                            /* Patients' use cases */
                            <ButtonGroup vertical>
                                <Button variant="outline-primary" onClick={() => { setAction(1); refetch({}) }}>Book a new appointment</Button>
                                <Button variant="outline-primary" onClick={() => { setAction(2); refetch({}) }}>Review past appointments</Button>
                                <Button variant="outline-primary" onClick={() => { setAction(3); refetch({}) }}>Check upcoming appointments</Button>
                            </ButtonGroup>
                        ) : (
                            /* Doctors' use cases */
                            <ButtonGroup vertical>
                                <Button variant="outline-primary" onClick={() => { setAction(11); refetch({}) }}>Review today's agenda</Button>
                                <Button variant="outline-primary" onClick={() => { setAction(12); refetch({}) }}>Review past appointments</Button>
                                <Button variant="outline-primary" onClick={() => { setAction(13); refetch({}) }}>Review a patient's history</Button>
                            </ButtonGroup>
                        )
                    }
                </div>
            )}
            { action === 1 ? <NewAppointment id={id} setAction={setAction} /> : <div></div> }
            { action === 2 ? <PastAppointments id={id} setAction={setAction} /> : <div></div>}
            { action === 3 ? <UpcomingAppointments id={id} setAction={setAction} /> : <div></div>}
            { action === 11 ? <TodayAgenda id={id} setAction={setAction} /> : <div></div> }
            { action === 12 ? <DoctorPastAppointments id={id} setAction={setAction} /> : <div></div>}
            { action === 13 ? <PatientHistory id={id} /> : <div></div> }
        </div>
    )
}

export default Home;
