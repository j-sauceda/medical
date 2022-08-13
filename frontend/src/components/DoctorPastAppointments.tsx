import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client';
import { Button, Table } from 'react-bootstrap';
import EditDiagnosis from './EditDiagnosis';

interface Props {
    id: number;
    setAction: React.Dispatch<React.SetStateAction<number>>,
}

interface PastApp {
    id: number,
    patientId: {
        firstName: string,
        lastName: string,
        dob: string,
        phone: string,
        email: string,
    }
    dateApp: Date,
    timeApp: Date,
    isDiagnosed: boolean,
    diagnosis: string,
    treatment: string,
}

const DoctorPastAppointments:React.FC<Props> = ({id}) => {
    const PAST_APPOINTMENTS_QUERY = gql`
    {
        pastAppointments (
            drUserId: ${id}
        ) {
            id
            patientId {
                firstName
                lastName
                dob
                phone
                email
                allergies
                permanentTreatments
            }
            dateApp
            timeApp
            isDiagnosed
            diagnosis
            treatment
        }
    }`

    let { loading, error, data, refetch } = useQuery(PAST_APPOINTMENTS_QUERY);
    const [appointmentSelected, setAppointmentSelected] = useState(-1);
    const [detailsVisible, setDetailsVisible] = useState(false);

    useEffect(() => {
        refetch();
    });

    if (loading) return (<div className="p-3 text-center"><h2>Retrieving data... please wait</h2></div>);
    if (error) return (<div className="p-3 text-center"><h2> {error.message} </h2></div>);

    return (
        <div className='p-3 text-center'>
            {(appointmentSelected !== -1 && appointmentSelected < data.pastAppointments.length) && (
                <div id="details" className={detailsVisible ? "collapse show" : "collapse"}>
                    <button
                        className="btn btn-secondary"
                        data-bs-toggle="collapse"
                        data-bs-target="#details"
                        onClick={() => { setDetailsVisible(!detailsVisible) }}
                    >
                        Show/Hide appointment details
                    </button>
                    <br /><br />
                    <Table id="details" className='table-striped table-bordered table-secondary'>
                        <thead>
                            <tr className="tr">
                                <th className="th">Date</th>
                                <th className="th">Time</th>
                                <th className="th">Patient</th>
                                <th className="th">Diagnosis</th>
                                <th className="th">Treatment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="tr table-light">
                                <td className="td"> {data.pastAppointments[appointmentSelected].dateApp.toString()} </td>
                                <td className="td"> {data.pastAppointments[appointmentSelected].timeApp.toLocaleString('en-US')} </td>
                                <td className="td"> {data.pastAppointments[appointmentSelected].patientId.firstName} {data.pastAppointments[appointmentSelected].patientId.lastName} (Born on: {data.pastAppointments[appointmentSelected].patientId.dob}; Phone: {data.pastAppointments[appointmentSelected].patientId.phone}; Allergies: {data.pastAppointments[appointmentSelected].patientId.allergies}; Permanent treatments: {data.pastAppointments[appointmentSelected].patientId.permanentTreatments}) </td>
                                <td className="td">
                                    {data.pastAppointments[appointmentSelected].isDiagnosed ? data.pastAppointments[appointmentSelected].diagnosis : "Diagnosis not recorded yet"}
                                </td>
                                <td className="td">
                                    {data.pastAppointments[appointmentSelected].isDiagnosed ? 
                                        data.pastAppointments[appointmentSelected].treatment
                                        : <EditDiagnosis appointmentId={data.pastAppointments[appointmentSelected].id} setAppointmentSelected={setAppointmentSelected} />}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            )
            }
            <h2>Past Appointments</h2>
            {data.pastAppointments.length !== 0 ? (
                <Table id="appointments" className="table-striped table-bordered table-warning table-hover">
                    <thead>
                        <tr className="tr table-primary">
                            <th className="th">Date</th>
                            <th className="th">Time</th>
                            <th className="th">Patient</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.pastAppointments.map((app: PastApp, index: number) => (
                                <tr className={index === appointmentSelected ? "tr table-secondary" : "tr"} key={index}>
                                    <td className="td"> {app.dateApp.toString()}&nbsp;
                                        <Button 
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setAppointmentSelected(index);
                                                setDetailsVisible(true); }
                                        } >
                                            See details
                                        </Button>
                                    </td>
                                    <td className="td"> {app.timeApp.toLocaleString('en-US')} </td>
                                    <td className="td"> {app.patientId.firstName} {app.patientId.lastName} (Born on: {app.patientId.dob}) </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            ) : (
                <div>
                    You have no past appointments in your record
                </div>
            )}
        </div>
    )
}

export default DoctorPastAppointments;
