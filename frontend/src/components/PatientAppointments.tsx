import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import CsvDownloader from 'react-csv-downloader';

import EditDiagnosis from './EditDiagnosis';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props {
    id: number,
    selectedPatientId: number,
    showPatientAppointments: boolean,
}

interface User {
    id: number,
    firstName: string,
    lastName: string,
}

interface Doctor {
    userId: User,
    specialties: string,
}

interface PastApp {
    id: number,
    doctorId: Doctor,
    dateApp: Date,
    timeApp: Date,
    isDiagnosed: boolean,
    diagnosis: string,
    treatment: string,
}

const PatientAppointments: React.FC<Props> = ({ id, selectedPatientId, showPatientAppointments }) => {
    const APPOINTMENTS_QUERY = gql`
    {
        pastAppointments (
            patient: ${selectedPatientId}
        ) {
            id
            doctorId {
                userId {
                    id
                    firstName
                    lastName
                }
                specialties
            }
            dateApp
            timeApp
            isDiagnosed
            diagnosis
            treatment
        }
    }`

    let { loading, error, data, refetch } = useQuery(APPOINTMENTS_QUERY);
    const [appointmentSelected, setAppointmentSelected] = useState<number>(-1);
    let headers = [
        { displayName: 'Date', id: 'dateApp'},
        { displayName: 'Time', id: 'timeApp'},
        { displayName: 'Doctor', id: 'doctorName'},
        { displayName: 'Diagnosis', id: 'diagnosis'},
        { displayName: 'Treatment', id: 'treatment'},
    ];
    let csvData: {dateApp: string, timeApp: string, doctorName: string, diagnosis: string, treatment: string}[] = [];
    const populateData = async () => {
        await data.pastAppointments.forEach((app: PastApp) => {
            csvData.push({
                'dateApp': app.dateApp.toString(),
                'timeApp': app.timeApp.toLocaleString('en-US'),
                'doctorName': "Dr. " + app.doctorId.userId.firstName + " " + app.doctorId.userId.lastName,
                'diagnosis': app.isDiagnosed ? app.diagnosis.toString() : "Not diagnosed yet",
                'treatment': app.isDiagnosed ? app.treatment.toString() : "Not diagnosed yet"
            });
        });
        return Promise.resolve(csvData);
    };

    useEffect(() => {
        refetch();
    });
    

    if (loading) return (<div className='p-3 text-center'><h2>Retrieving data... please wait</h2></div>);
    if (error) return (<div className='p-3 text-center'><h2> {error.message} </h2></div>);

    return (
        <div id="details" className={showPatientAppointments ? "p-2 collapse show" : "p-2 collapse"} >
            <h4>Patient previous appointments</h4>
            {data.pastAppointments.length !== 0 ? (
                <div>
                    <br />
                    <CsvDownloader
                        filename = "medical_history"
                        extension = ".csv"
                        separator = ","
                        columns = {headers}
                        datas = {csvData}
                    >
                        <Button onClick={populateData} className="btn btn-secondary" > Download Medical History </Button>
                    </CsvDownloader>
                    <br /><br />
                    <Table id="appointments" className="table-striped table-bordered table-warning table-hover">
                        <thead>
                            <tr className="tr table-primary">
                                <th className="th">Date</th>
                                <th className="th">Time</th>
                                <th className="th">Doctor</th>
                                <th className="th">Diagnosis</th>
                                <th className="th">Treatment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.pastAppointments.map((app: PastApp, index: number) => (
                                    <tr className={appointmentSelected === app.id ? "tr table-secondary" : "tr"} key={index}>
                                        <td className="td"> {app.dateApp.toString()} </td>
                                        <td className="td"> {app.timeApp.toLocaleString('en-US')} </td>
                                        <td className="td"> Dr. {app.doctorId.userId.firstName} {app.doctorId.userId.lastName} ({app.doctorId.specialties}) </td>
                                        <td className="td"> { app.isDiagnosed ? app.diagnosis : "Not diagnosed yet"} </td>
                                        <td className="td">
                                            { app.isDiagnosed ? ( app.treatment.toString() ) : 
                                                (!app.isDiagnosed && id === +app.doctorId.userId.id) ?
                                                    ( <EditDiagnosis appointmentId={app.id} setAppointmentSelected={setAppointmentSelected} /> ) : 
                                                    ("Consult Dr. " + app.doctorId.userId.firstName + " " + app.doctorId.userId.lastName)
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>
            ) : (
                <div>
                    There are no past appointments in this patient's record yet.
                </div>
            )}
        </div>
    )
}

export default PatientAppointments;
