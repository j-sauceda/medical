import React, { useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import { Alert, Button, Modal, Table } from 'react-bootstrap';

interface Props {
    id: number;
    setAction: React.Dispatch<React.SetStateAction<number>>,
}

interface FutureApp {
    id: number,
    doctorId: {
        userId: {
            firstName: string,
            lastName: string
        }
        specialties: string,
    }
    dateApp: Date,
    timeApp: Date,
}

const UpcomingAppointments:React.FC<Props> = ({id, setAction}) => {
    const [viewMsg, setViewMsg] = useState(false);
    const [appointmentSelected, setAppointmentSelected] = useState(-1);
    const [indexAppSelected, setIndexAppSelected] = useState(-1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const closeModal = () => { setModalIsOpen(false); setAppointmentSelected(-1) };

    useEffect(() => {
        refetch({});
    });

    const FUTURE_APPOINTMENTS_QUERY = gql`
    {
        upcomingAppointments (
            patient: ${id}
        ) {
            id
            doctorId {
                userId {
                    firstName
                    lastName
                }
                specialties
            }
            dateApp
            timeApp
        }
    }`

    const DELETE_APPOINTMENT_MUTATION = gql`
    mutation deleteAppointment($appointmentSelected: Int!) {
        deleteAppointment(
            id: $appointmentSelected
        ) {
            appointment {
                id
            }
        }
    }`

    let { loading, error, data, refetch } = useQuery(FUTURE_APPOINTMENTS_QUERY);
    const [deleteAppointment] = useMutation(DELETE_APPOINTMENT_MUTATION);

    if (loading) return (<div className="p-3"><h2>Retrieving data... please wait</h2></div>);
    if (error) return (<div className="p-3"><h2> {error.message} </h2></div>);

    let drName = (indexAppSelected !== -1 && data.upcomingAppointments[indexAppSelected]) ? (data.upcomingAppointments[indexAppSelected].doctorId.userId.firstName + " " + data.upcomingAppointments[indexAppSelected].doctorId.userId.lastName) : "";
    let appDate = (indexAppSelected !== -1 && data.upcomingAppointments[indexAppSelected]) ? (data.upcomingAppointments[indexAppSelected].dateApp.toLocaleString().split(",")[0]) : new Date();
    let appTime = (indexAppSelected !== -1 && data.upcomingAppointments[indexAppSelected]) ? (data.upcomingAppointments[indexAppSelected].timeApp.toLocaleString('en-US')) : "";

    return (
        <div className='p-3 text-center'>
            <h2>Future Appointments</h2>
            <Alert variant="success" show={viewMsg} onClose={() => { setViewMsg(false) }} dismissible>
                <Alert.Heading> Attention! </Alert.Heading>
                <p> Appointment canceled </p>
            </Alert>
            <br />
            
            {data.upcomingAppointments.length !== 0 ? (
                <Table id="appointments" className="table-striped table-bordered table-warning table-hover">
                    <thead>
                        <tr className="tr table-primary">
                            <th className="th">Date</th>
                            <th className="th">Time</th>
                            <th className="th">Doctor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.upcomingAppointments.map((app: FutureApp, index: number) => (
                                <tr className={index === appointmentSelected ? "tr table-secondary" : "tr"} key={index}>
                                    <td className="td"> {app.dateApp.toString()} &nbsp;
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setAppointmentSelected(app.id);
                                                setIndexAppSelected(index);
                                                setModalIsOpen(true);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Modal show={modalIsOpen} onHide={closeModal} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirmation</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Cancel appointment with Dr. {drName} on {appDate} at {appTime}?
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={closeModal}>
                                                    No
                                                </Button>
                                                <Button variant="danger" onClick={async () => {
                                                    const response = await deleteAppointment({ variables: { appointmentSelected } });
                                                    if (response.data.deleteAppointment == null) {
                                                        setModalIsOpen(false);
                                                        refetch({});
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
                                    </td>
                                    <td className="td"> {app.timeApp.toLocaleString('en-US')} </td>
                                    <td className="td"> Dr. {app.doctorId.userId.firstName} {app.doctorId.userId.lastName} ({app.doctorId.specialties}) </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            ) : (
                <div>
                    <p> You have no upcoming appointments yet </p>
                    <Button onClick={() => setAction(1)}>Book a new appointment</Button>
                </div>
            )}
        </div>
    )
}

export default UpcomingAppointments;
