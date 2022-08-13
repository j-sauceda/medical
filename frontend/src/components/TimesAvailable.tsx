import React from 'react'
import { gql, useQuery } from '@apollo/client';

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col } from "react-bootstrap";
import en from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
registerLocale('en', en);
# registerLocale('es', es);
setDefaultLocale('en');


interface Props {
    doctor: number,
    date: Date,
    startHour: number,
    endHour: number,
    lunchHour: number,
    minPerApp: number,
    timeSelected: Date,
    setTimeSelected: React.Dispatch<React.SetStateAction<Date>>,
    setStep: React.Dispatch<React.SetStateAction<number>>,
}

interface Appointment {
    timeApp: string
}

const TimesAvailable : React.FunctionComponent<Props> = ({ doctor, date, startHour, endHour, lunchHour, minPerApp, setTimeSelected, setStep }) => {
    const drAppointments = gql`
        {
            appointments (
                drUserId: ${doctor},
                date: "${date}"
            ) {
                timeApp
            }
        }`

    const changeTime = (hh: number, min: number) => {
        let result = new Date();
        result.setMinutes(min);
        result.setHours(hh);
        return result;
    }

    let { loading, error, data, refetch: refetchTimes } = useQuery(drAppointments, {variables: {doctor, date}});

    if (loading) return (<div className="p-3"><h2>Retrieving data... please wait</h2></div>);
    if (error) {
        return (<div className="p-3"><h2> {error.message} </h2></div>);
    }

    let excludedTimes: Date[] = [];
    let appHours: number[] = [];
    let appMinutes: number[] = [];

    function updateTimes() {
        if (data !== null) {
            excludedTimes = [];
            appHours = [];
            appMinutes = [];
            data.appointments.forEach((appointment: Appointment, i: number) => {
                appHours.push(parseInt(appointment.timeApp.split(":")[0]));
                appMinutes.push(parseInt(appointment.timeApp.split(":")[1]));
                excludedTimes.push(changeTime(appHours[i], appMinutes[i]))
            })
        }
        excludedTimes.push(changeTime(lunchHour, 0));
    }
    updateTimes();
        
    return (
        <div className='p-3'>
            <h2>Set the time for the new appointment</h2>
            <Container fluid>
                <Row>
                    <Col>
                        <DatePicker
                            locale="en"
                            placeholderText="Select appointment time"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={minPerApp}
                            minTime={changeTime(startHour, 0)}
                            maxTime={changeTime(endHour, 0)}
                            excludeTimes={excludedTimes}
                            timeCaption="Time"
                            dateFormat="hh:mm aa"
                            onInputClick={() => {
                                refetchTimes();
                                updateTimes();
                            }}
                            onChange={(time) => {
                                if (time !== null) {
                                    setTimeSelected(time);
                                    setStep(4);
                                }
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default TimesAvailable;
