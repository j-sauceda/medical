import React, { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client';
import { Button, Table } from 'react-bootstrap';
import EditDiagnosis from './EditDiagnosis';

interface Props {
    id: number;
    setAction: React.Dispatch<React.SetStateAction<number>>,
}

interface App {
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

const TodayAgenda:React.FC<Props> = ({id}) => {
    let date = new Date();
    let month = ""
    if (date.getMonth() < 9) month = "0" + (date.getMonth() + 1).toString();
    else month = (date.getMonth() + 1).toString();
    let dateISO = date.getFullYear().toString() + "-" + month + "-" + date.getDate().toString();
    
    const TODAY_APPOINTMENTS_QUERY = gql`
    query {
        appointments (
            drUserId: ${id},
            date: "${dateISO}"
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

    let { loading, error, data, refetch } = useQuery(TODAY_APPOINTMENTS_QUERY);
    const [appointmentSelected, setAppointmentSelected] = useState(-1);
    const [detailsVisible, setDetailsVisible] = useState(false);

    useEffect(() => {
        refetch();
    });

    if (loading) return (<div className="p-3 text-center"><h2>Retrieving data... please wait</h2></div>);
    if (error) return (<div className="p-3 text-center"><h2> {error.message} </h2></div>);
    
    return (
        <div className='p-3 text-center'>
            {(appointmentSelected !== -1 && appointmentSelected < data.appointments.length) && (
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
                                <td className="td"> {data.appointments[appointmentSelected].dateApp.toString()} </td>
                                <td className="td"> {data.appointments[appointmentSelected].timeApp.toLocaleString('en-US')} </td>
                                <td className="td"> {data.appointments[appointmentSelected].patientId.firstName} {data.appointments[appointmentSelected].patientId.lastName} (Born on: {data.appointments[appointmentSelected].patientId.dob}; Phone: {data.appointments[appointmentSelected].patientId.phone}; Allergies: {data.appointments[appointmentSelected].patientId.allergies}; Permanent treatments: {data.appointments[appointmentSelected].patientId.permanentTreatments}) </td>
                                <td className="td">
                                    {data.appointments[appointmentSelected].isDiagnosed ? data.appointments[appointmentSelected].diagnosis : "Diagnosis not recorded yet"}
                                </td>
                                <td className="td">
                                    { data.appointments[appointmentSelected].isDiagnosed ? 
                                        ( data.appointments[appointmentSelected].treatment )
                                        : <EditDiagnosis appointmentId={data.appointments[appointmentSelected].id} setAppointmentSelected={setAppointmentSelected} />
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            )
            }
            <h2>Today's Agenda</h2>
            {data.appointments.length !== 0 ? (
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
                            data.appointments.map((app: App, index: number) => (
                                <tr className={index === appointmentSelected ? "tr table-secondary" : "tr"} key={index}>
                                    <td className="td"> {app.dateApp.toString()}&nbsp;
                                        <Button onClick={() => { setAppointmentSelected(index); setDetailsVisible(true); }} variant="outline-secondary" >
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
                    You have no appointments today
                </div>
            )}
        </div>
    )
}

export default TodayAgenda;
