import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { Button, Table } from 'react-bootstrap';

interface Props {
    showPatientsList: boolean,
    setShowPatientsList: React.Dispatch<React.SetStateAction<boolean>>,
    selectedPatientId: number,
    setSelectedPatientId: React.Dispatch<React.SetStateAction<number>>,
}

interface User {
    id: number,
    isDoctor: boolean,
    username: string,
    firstName: string,
    lastName: string,
    dob: Date
}

const USERS_QUERY = gql`
{
  allUsers {
    id
    isDoctor
    username
    firstName
    lastName
    dob
  }
}`

const SelectPatient: React.FC<Props> = ({ showPatientsList, setShowPatientsList, selectedPatientId, setSelectedPatientId }) => {
    const { loading, error, data } = useQuery(USERS_QUERY);

    if (loading) return (<div className='p-3 text-center'><h2>Retrieving data... please wait</h2></div>);
    if (error) return (<div className='p-3 text-center'><h2> {error.message} </h2></div>);

    return (
        <div id="patients" className={showPatientsList ? "collapse show" : "collapse"}>
            <h4>Select a patient</h4>
            {data.allUsers.length !== 0 ? (
                <Table id="patients_list" className="table-striped table-bordered table-warning table-hover">
                    <thead>
                        <tr className="tr table-primary">
                            <th className="th">Full Name</th>
                            <th className="th">Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.allUsers.map((user: User) => (
                                user.username !== "admin" && (
                                <tr className={user.id === selectedPatientId ? "tr table-secondary" : "tr"} key={user.id}>
                                    <td className="td"> {user.isDoctor && "Dr." } {user.firstName} {user.lastName} &nbsp;
                                        <Button variant="outline-primary" onClick={() => {
                                            setSelectedPatientId(user.id);
                                                setShowPatientsList(!showPatientsList);
                                        }}
                                        >
                                            Select
                                        </Button>
                                    </td>
                                    <td className="td">{user.dob !== null ? user.dob.toString(): ""} </td>
                                </tr>)
                            ))
                        }
                    </tbody>
                </Table>
            ) : (
                <div>
                    There are no patients yet, please be patient (oh the irony!)
                </div>
            )}
        </div>
    )
}

export default SelectPatient;
