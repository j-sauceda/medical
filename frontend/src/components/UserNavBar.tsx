import React from 'react'
import Logout from "../components/Logout";
import { Button, Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

interface Props {
    isDoctor: boolean,
    setAction: React.Dispatch<React.SetStateAction<number>>,
}

const UserNavBar:React.FC<Props> = ({setAction, isDoctor}) => {
    return (
        <div>
            <Navbar bg="light" variant={'light'} expand={false} className="mb-3">
                <Container fluid>
                    <Navbar.Offcanvas placement="start" id={`offcanvasNavbar-expand-false`} aria-labelledby={`offcanvasNavbarLabel-expand-false`} >
                        {
                            isDoctor ? (
                                <div>
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}> Doctor Menu </Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body>
                                        <Nav className="justify-content-end flex-grow-1 pe-3">
                                            <Button variant="outline-secondary" onClick={() => setAction(11)}>Today's agenda</Button>
                                            <Button variant="outline-secondary" onClick={() => setAction(12)}>Past Appointments</Button>
                                            <Button variant="outline-secondary" onClick={() => setAction(13)}>Patient History</Button>
                                            <Logout />
                                        </Nav>
                                    </Offcanvas.Body>
                                </div>
                            ) : (
                                <div>
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}> User Menu </Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body>
                                        <Nav className="justify-content-end flex-grow-1 pe-3">
                                            <Button variant="outline-secondary" onClick={() => setAction(1)}>New Appointment</Button>
                                            <Button variant="outline-secondary" onClick={() => setAction(2)}>Past Appointments</Button>
                                            <Button variant="outline-secondary" onClick={() => setAction(3)}>Upcoming Appointments</Button>
                                            <Logout />
                                            {/* Reset password link? */}
                                        </Nav>
                                    </Offcanvas.Body>
                                </div>
                            )
                        }
                    </Navbar.Offcanvas>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
                    <Navbar.Text>
                        <Logout />
                    </Navbar.Text>
                </Container>
            </Navbar>
        </div>
    )
}

export default UserNavBar;
