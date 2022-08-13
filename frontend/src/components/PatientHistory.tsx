import React, { useRef, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import PatientAppointments from './PatientAppointments';
import PatientDetails from './PatientDetails';
import SelectPatient from './SelectPatient';

interface Props {
    id: number,
}

const PatientHistory:React.FC<Props> = ({id}) => {
    const [selectedPatientId, setSelectedPatientId] = useState(-1);
    const [showPatientsList, setShowPatientsList] = useState(true);
    const [showPatientDetails, setShowPatientDetails] = useState(true);
    const [showPatientAppointments, setShowPatientAppointments] = useState(true);
    
    return (
        <div className='p-3 text-center'>
            <Button
                className="btn btn-secondary"
                data-bs-toggle="collapse"
                data-bs-target="#details"
                onClick={() => { setShowPatientsList(!showPatientsList) }}
            >
                Show/Hide patients list
            </Button>
            <br /><br />
            <SelectPatient 
                showPatientsList={showPatientsList}
                setShowPatientsList={setShowPatientsList}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
            />
            {
                selectedPatientId !== -1 && (
                    <div>
                        <ButtonGroup>
                            <Button
                                className="btn btn-secondary"
                                data-bs-toggle="collapse"
                                data-bs-target="#details"
                                onClick={() => { setShowPatientDetails(!showPatientDetails) }}
                            >
                                Show/Hide patient's profile
                            </Button> &nbsp;
                            <Button
                                className="btn btn-secondary"
                                data-bs-toggle="collapse"
                                data-bs-target="#appointments"
                                onClick={() => { setShowPatientAppointments(!showPatientAppointments) }}
                            >
                                Show/Hide patient's appointments
                            </Button>
                        </ButtonGroup>
                        <div className='p-1'>
                            <PatientDetails selectedPatientId={selectedPatientId} showPatientDetails={showPatientDetails} />
                            <PatientAppointments id={id} selectedPatientId={selectedPatientId} showPatientAppointments={showPatientAppointments} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default PatientHistory;
