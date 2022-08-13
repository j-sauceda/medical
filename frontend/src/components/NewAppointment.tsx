import React, { useState } from 'react'

import Doctors from "../components/Doctors";
import SelectDate from "../components/SelectDate";
import TimesAvailable from "../components/TimesAvailable";
import CreateAppointment from "../components/CreateAppointment";

interface Props {
    id: number,
    setAction: React.Dispatch<React.SetStateAction<number>>,
}

const NewAppointment:React.FC<Props> = ({id, setAction}) => {
    const [step, setStep] = useState<number>(1);
    const [doctor, setDoctor] = useState<number>(0);
    const [doctorName, setDoctorName] = useState<string>("");
    const [dateSelected, setDateSelected] = useState<Date>(new Date());
    const [timeSelected, setTimeSelected] = useState<Date>(new Date());
    const [startHour, setStartHour] = useState<number>(9);
    const [endHour, setEndHour] = useState<number>(18);
    const [lunchHour, setLunchHour] = useState<number>(13);
    const [minPerApp, setMinPerApp] = useState<number>(60);

    return (
        <div className="p-3 text-center">
            {step === 1 ? (
                <div id="doctors" className="p-3">
                    <Doctors
                        doctorId={doctor} setDoctorId={setDoctor}
                        setDoctorName={setDoctorName}
                        setStep={setStep}
                        setStartHour={setStartHour}
                        setEndHour={setEndHour}
                        setLunchHour={setLunchHour}
                        setMinPerApp={setMinPerApp}
                    />
                </div>
            ) : <div></div>}
            {step === 2 ? (
                <div>
                    <SelectDate dateSelected={dateSelected} setDateSelected={setDateSelected} setStep={setStep} />
                </div>
            ) : <div></div>}
            {step === 3 ? (
                <div>
                    <TimesAvailable
                        doctor={doctor}
                        date={dateSelected}
                        startHour={startHour}
                        endHour={endHour}
                        lunchHour={lunchHour}
                        minPerApp={minPerApp}
                        timeSelected={timeSelected}
                        setTimeSelected={setTimeSelected}
                        setStep={setStep}
                    />
                </div>
            ) : <div></div>}
            {(step === 4) ?
                (<div>
                    <CreateAppointment
                        id={id}
                        doctor={doctor}
                        doctorName={doctorName}
                        date={dateSelected}
                        time={timeSelected}
                        setStep={setStep}
                        setAction={setAction}
                    />
                </div>) : <div></div>
            }
        </div>
    )
}

export default NewAppointment
