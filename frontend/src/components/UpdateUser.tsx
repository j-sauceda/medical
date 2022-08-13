import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Alert } from 'react-bootstrap';
import * as Yup from "yup";

interface Props {
    id: number,
    setGlobalMsg: React.Dispatch<React.SetStateAction<string>>,
    setViewGlobalMsg: React.Dispatch<React.SetStateAction<boolean>>,
}

interface LoginValues {
    id: number,
    firstName: string,
    lastName: string,
    dob: Date,
    phone: string,
    address: string
}

const UpdateUser: React.FC<Props> = ({ id, setGlobalMsg, setViewGlobalMsg }) => {
    const [msg, setMsg] = useState<string>("");
    const [viewMsg, setViewMsg] = useState<boolean>(false);
    
    const UPDATE_USER_MUTATION = gql`
	mutation updateUser($id: Int!, $firstName: String!, $lastName: String!, $dob: Date!, $phone: String!, $address: String!) {
        updateUser (
            id: $id,
            firstName: $firstName,
            lastName: $lastName,
            dob: $dob,
            phone: $phone,
            address: $address
            ) {
                user {
                id
            }    
        }    
    }`

    const [updateUser] = useMutation(UPDATE_USER_MUTATION);
    
    const initialValues: LoginValues = {
        id: 0,
        firstName: "",
        lastName: "",
        dob: new Date("0476-01-01T00:00:00"),
        phone: "",
        address: ""
    }

    const validationSchema = Yup.object({
        firstName: Yup.string().max(50, "Given name must be 50 characters or less").required("Given name required"),
        lastName: Yup.string().max(50, "Family name must be 50 characters or less").required("Family name required"),
        dob: Yup.date().required("Date of birth required"),
        phone: Yup.string().max(20, "Phone must be 20 characters or less").required("Phone number required"),
        address: Yup.string().max(255, "Given name must be 255 characters or less").required("Address required"),
    })

    return (
        <div>
            <h3>Please, update your profile data</h3>
            {
                msg === "" && (
                    <div className="mb-3 text-center">
                        <Alert variant="warning" show={viewMsg} onClose={() => setViewMsg(false)} dismissible>
                            <Alert.Heading> Attention! </Alert.Heading>
                            <p> {msg} </p>
                        </Alert>
                        <br />
                    </div>
                )
            }
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    values = {...values, id: id};
                    const response = await updateUser({ variables: values });
                    if (response.data.updateUser.user.id != null ) {
                        setGlobalMsg("User profile updated");
                        setViewGlobalMsg(true);
                        setSubmitting(false);
                    }
                    else if (response.data.errors) {
                        setMsg(response.data.errors.message.toString());
                        setViewMsg(true);
                        setSubmitting(false);
                    }
                }}
            >
                <Form>
                    <div className="mb-3">
                        <span>Given Name:&nbsp;</span>
                        <Field name="firstName" type="text" placeholder="What is your given name?" />
                    </div>
                    <div className="mb-3">
                        <span>Family Name:&nbsp;</span>
                        <Field name="lastName" type="text" placeholder="What is your surname?" />
                    </div>
                    <div className="mb-3">
                        <span>Date of Birth:&nbsp;</span>
                        <Field name="dob" type="date" placeholder="DOB?" />
                    </div>
                    <div className="mb-3">
                        <span>Phone number:&nbsp;</span>
                        <Field name="phone" type="text" placeholder="What's your phone?" />
                    </div>
                    <div className="mb-3">
                        <span>Address:&nbsp;</span>
                        <Field name="address" type="text" placeholder="What is your address?" />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">
                            <span>Update profile</span>
                        </button>
                    </div>

                    <ErrorMessage name="firstName" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="lastName" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="dob" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="phone" className="alert alert-warning" component={"div"} />
                    <ErrorMessage name="address" className="alert alert-warning" component={"div"} />
                </Form>
            </Formik>
        </div>
    )
}

export default UpdateUser;
