import React, { useState } from 'react'
import { gql, useMutation } from "@apollo/client";
import {Alert, Button, Modal } from 'react-bootstrap';

interface Props {
    id: number,
    doctor: number,
    doctorName: String,
    date: Date,
    time: Date,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    setAction: React.Dispatch<React.SetStateAction<number>>,
}

const CreateAppointment:React.FC<Props> = ({id, doctor, doctorName, date, time, setStep, setAction}) => {
    const [viewMsg, setViewMsg] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [buttonIsVisible, setButtonIsVisible] = useState(true);
    let timeLocale = time.toTimeString().split(" ")[0];

    const closeCreate = () => {setModalIsOpen(false); setStep(1)};
    const openCreate = () => setModalIsOpen(true);

    const APPOINTMENT_MUTATION = gql`
    mutation createAppointment($id: Int!, $doctor: Int!, $date: Date!, $timeLocale: Time!) {
        createAppointment(
            patient: $id,
            drUserId: $doctor,
            date: $date,
            time: $timeLocale,
        ) {
            appointment {
                dateApp
                timeApp
            }
        }
    }`

    const [createAppointment] = useMutation(APPOINTMENT_MUTATION);
    
    return (
        <div className="mb-3">
            <div className="p-3 text-center">
                <div> You have selected Dr. {doctorName} </div>
                <div> Date: {date.toString()}, Time: {time.toLocaleTimeString()} </div>
            </div>

            <Alert variant="success" show={viewMsg} onClose={() => {setViewMsg(false); setStep(1);}} dismissible>
                <Alert.Heading> Attention! </Alert.Heading>
                <p> Appointment created </p>
                <p> <Button onClick={() => setAction(3)}> See Upcoming Appointments </Button> </p>
            </Alert>
            <br />

            <Button variant={buttonIsVisible ? "primary collapse show": "primary collapse"} onClick={openCreate}>
                Create Appointment
            </Button>
            <Modal show={modalIsOpen} onHide={closeCreate} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Create appointment with Dr. {doctorName} on {date.toLocaleString().split(",")[0]} at {time.toLocaleString().split(",")[1]}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeCreate}>
                        No
                    </Button>
                    <Button variant="danger" onClick={async () => {
                        const response = await createAppointment({ variables: { id, doctor, date, timeLocale }});
                            if (response.data.createAppointment.appointment.dateApp !== null) {
                                setModalIsOpen(false);
                                setButtonIsVisible(false);
                                setViewMsg(true);
                            }
                            else {
                                console.log(response.toString());
                            }
                        }
                    }>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateAppointment;
