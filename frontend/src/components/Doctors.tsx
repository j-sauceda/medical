import React from 'react';
import {gql, useQuery} from '@apollo/client';
import { Button, Table } from 'react-bootstrap';

const doctorsQuery = gql`
{
  allDoctors {
    id
    businessHours {
        startTime
        endTime
        lunchTime
        minutesPerAppointment
    }
    userId {
        id
        firstName
        lastName
    }
    specialties
  }
}`

interface BusinessHour {
    startTime: string,
    endTime: string,
    lunchTime: string,
    minutesPerAppointment: string,
}

interface User {
    id: number,
    firstName: string,
    lastName: string
}

interface Doctor {
    id: number,
    businessHours: BusinessHour,
    userId: User,
    specialties: string
}

interface Props {
    doctorId: number,
    setDoctorId: React.Dispatch<React.SetStateAction<number>>,
    setDoctorName: React.Dispatch<React.SetStateAction<string>>,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    setStartHour: React.Dispatch<React.SetStateAction<number>>,
    setEndHour: React.Dispatch<React.SetStateAction<number>>,
    setLunchHour: React.Dispatch<React.SetStateAction<number>>,
    setMinPerApp: React.Dispatch<React.SetStateAction<number>>,
}

const Doctors:React.FC <Props> = ({doctorId, setDoctorId, setDoctorName, setStep, setStartHour, setEndHour, setLunchHour, setMinPerApp}) => {
    const {loading, error, data} = useQuery(doctorsQuery);

    if (loading) return (<div className='p-3 text-center'><h2>Retrieving data... please wait</h2></div>);
    if (error) return (<div className='p-3 text-center'><h2> {error.message} </h2></div>);

    return (
        <div>
            <h2>Select a doctor</h2>
            { data.allDoctors.length !==0 ? (
                <Table id="doctors" className="table-striped table-bordered table-warning table-hover">
                    <thead>
                        <tr className="tr table-primary">
                            <th className="th">Doctor</th>
                            <th className="th">Specialties</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data.allDoctors.map((dr: Doctor, index: number) => (
                            <tr className={dr.id === doctorId ? "tr table-success" : "tr"} key={dr.id}>
                                <td className="td">{dr.userId.firstName} {dr.userId.lastName} &nbsp;
                                    <Button variant="secondary" onClick={() => {
                                        setDoctorId(dr.userId.id);
                                        setDoctorName(dr.userId.firstName + " " + dr.userId.lastName);
                                        setStartHour(parseInt(data.allDoctors[index].businessHours.startTime));
                                        setEndHour(parseInt(data.allDoctors[index].businessHours.endTime));
                                        setLunchHour(parseInt(data.allDoctors[index].businessHours.lunchTime));
                                        setMinPerApp(parseInt(data.allDoctors[index].businessHours.minutesPerAppointment));
                                        setStep(2);
                                        }}
                                    >
                                        Select
                                    </Button>
                                </td>
                                <td className="td">{dr.specialties} </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            ): (
                <div>
                    There are no doctors available, contact the clinic administration
                </div>
            ) }
        </div>
    )
}

export default Doctors;
