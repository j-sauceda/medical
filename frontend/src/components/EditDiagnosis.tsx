import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import { Button, Modal } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

interface Props {
    appointmentId: number,
    setAppointmentSelected: React.Dispatch<React.SetStateAction<number>>,
}

interface DiagnosisValues {
    appointmentId: number,
    diagnosis: string,
    treatment: string,
}

const EditDiagnosis: React.FC<Props> = ({ appointmentId, setAppointmentSelected }) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const closeModal = () => { setModalIsOpen(false); setAppointmentSelected(-1); }
    const openModal = () => setModalIsOpen(true);

    const initialValues: DiagnosisValues = {
        appointmentId: 0,
        diagnosis: "",
        treatment: ""
    }

    const validationSchema = Yup.object({
        diagnosis: Yup.string().max(1000, "Username must be 1000 characters or less. Consider using a web storage for attachments.").required("Diagnosis required"),
        treatment: Yup.string().max(1000, "Password must be 1000 characters or less. Consider using a web storage for attachments.").required("Treatment required")
    })

    const UPDATE_APPOINTMENT_MUTATION = gql`
    mutation updateAppointment($appointmentId: Int!, $diagnosis: String!, $treatment: String!) {
        updateAppointment (
            id: $appointmentId,
            diagnosis: $diagnosis,
            treatment: $treatment
        ) {
            appointment {
                isDiagnosed
            }
        }
    }`

    const [updateAppointment] = useMutation(UPDATE_APPOINTMENT_MUTATION);

    return (
        <div className="p-3 text-right">
            <Button variant="outline-primary" onClick={openModal}>
                Edit Diagnosis
            </Button>

            <Modal show={modalIsOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Diagnosis</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true)
                            values = { ...values, appointmentId: appointmentId }
                            const response = await updateAppointment({ variables: values });
                            if (response.data.updateAppointment.appointment.isDiagnosed) {
                                setAppointmentSelected(appointmentId);
                                setSubmitting(false);
                            }
                            else if (response.data.errors) {
                                console.log(response.data.errors.toString());
                            }
                            setModalIsOpen(false);
                        }}
                    >
                        <Form>
                            <div className="mb-3">
                                <span>Diagnosis:&nbsp;</span>
                                <Field name="diagnosis" type="text" placeholder="Enter your diagnosis" />
                            </div>
                            <div className="mb-3">
                                <span>Treatment:&nbsp;</span>
                                <Field name="treatment" type="text" placeholder="Enter prescribed treatment" />
                            </div>
                            <div className="mb-3">
                                <Button type="submit" variant="btn btn-primary"> Submit diagnosis </Button>
                            </div>

                            <ErrorMessage name="diagnosis" className="alert alert-warning" component={"div"} />
                            <ErrorMessage name="treatment" className="alert alert-warning" component={"div"} />
                        </Form>
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default EditDiagnosis;
