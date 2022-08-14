import React from 'react';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

interface Props {
    dateSelected: Date,
    setDateSelected: React.Dispatch<React.SetStateAction<Date>>,
    setStep: React.Dispatch<React.SetStateAction<number>>,
}

interface FormValues {
    date: Date,
}

const initialValues: FormValues = {
    date: new Date("0476-01-01T00:00:00"),
}

const validationSchema = Yup.object({
    date: Yup.date().min(new Date().toISOString()).required("Date required"),
})

const SelectDate: React.FC<Props> = ({ setDateSelected, setStep }) => {
    return (
    <div>
        <h2>Select a date</h2>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                setDateSelected(values.date);
                setStep(3);
        }}>
            <Form>
                <div className="mb-3">
                    <label>Date:&nbsp;</label> <Field name="date" type="date" placeholder="Appointment Date?" />
                </div>
                <div className="mb-3">
                        <button type="submit" className="btn btn-primary" >
                            Select date
                        </button>
                </div>

                <ErrorMessage name="date" className="alert alert-warning" component={"div"} />
            </Form>
        </Formik>
    </div>
    )
}

export default SelectDate;
