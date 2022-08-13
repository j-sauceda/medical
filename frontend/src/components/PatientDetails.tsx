import React from 'react'
import { gql, useQuery } from '@apollo/client';
import CsvDownloader from 'react-csv-downloader';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props{
    showPatientDetails: boolean,
    selectedPatientId: number,
}

const PatientDetails: React.FC<Props> = ({ selectedPatientId, showPatientDetails }) => {
    const USER_QUERY = gql`
    query {
        user (userId: ${selectedPatientId}) {
            id
            isDoctor,
            firstName
            lastName
            dob
            phone
            email
            allergies
            permanentTreatments
        }
    }`

    const { loading, error, data } = useQuery(USER_QUERY);
    let headers = [
        { displayName: "Patient's Name", id: 'name'},
        { displayName: 'Date of Birth', id: 'dob'},
        { displayName: 'Phone', id: 'phone'},
        { displayName: 'Email', id: 'email'},
        { displayName: 'Allergies', id: 'allergies'},
        { displayName: 'Permanent Treatments', id: 'permanentTreatments'},
    ];
    let csvData: {name: string, dob: string, phone: string, email: string, allergies: string, permanentTreatments: string}[] = [];
    const populateData = async () => {
        csvData.push({
            'name': (data.user.isDoctor ? 'Dr. ' : "") + data.user.firstName + " " + data.user.lastName,
            'dob': data.user.dob !== null ? data.user.dob.toString() : "",
            'phone': data.user.phone,
            'email': data.user.email,
            'allergies': data.user.allergies,
            'permanentTreatments': data.user.permanentTreatments
        });
        return Promise.resolve(csvData);
    };

    if (loading) return (<div className='p-3 text-center'><h2>Retrieving data... please wait</h2></div>);
    if (error) return (<div className='p-3 text-center'><h2> {error.message} </h2></div>);
    
    return (
        <div id="details" className={showPatientDetails ? "p-2 collapse show" : "p-2 collapse"} >
            <h4>Patient profile</h4>
            <br />
            <CsvDownloader
                filename = "patient_profile"
                extension = ".csv"
                separator = ","
                columns = {headers}
                datas = {csvData}
            >
                <Button onClick={populateData} className="btn btn-secondary" > Download Patient Profile </Button>
            </CsvDownloader>
            <br /><br />
            <Table id="patients_list" className="table-striped table-bordered table-warning table-hover">
                <thead>
                    <tr className="tr table-primary">
                        <th className="th">Full Name</th>
                        <th className="th">Date of Birth</th>
                        <th className="th">Phone</th>
                        <th className="th">Email</th>
                        <th className="th">Allergies</th>
                        <th className="th">Permanent Treatments</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={data.user.id === selectedPatientId ? "tr table-secondary" : "tr"} key={data.user.id}>
                        <td className="td">
                            {data.user.isDoctor && 'Dr.'} {data.user.firstName} {data.user.lastName}
                        </td>
                        <td className="td">
                            {data.user.dob !== null ? data.user.dob.toString() : ""}
                        </td>
                        <td className="td"> {data.user.phone} </td>
                        <td className="td"> {data.user.email} </td>
                        <td className="td"> {data.user.allergies} </td>
                        <td className="td"> {data.user.permanentTreatments} </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default PatientDetails;
