import React from 'react';
import {
    Row,
    Col,
    Panel,
    Button,
    Form,
    FormGroup,
    FormControl,
    Checkbox
} from 'components';
import { Link } from 'react-router';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_FLUID } from 'layouts/DefaultLayout/modules/layout';

import classes from './../Pages.scss';
import logo from 'static/envel-logo-inverted.png';

import NotificationSystem from 'react-notification-system';
import { bindActionCreators } from 'redux';
import { registerUser } from '../../../actions/userActions';
import { toastr } from '../../../utils/toastr';

class RegisterContainer extends RoutedComponent {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);

        this.state = {
            userInput: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            errors: {},
            isChecked: false
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onTextChangeUpper = this.onTextChangeUpper.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onTextChange(event) {
        let userInput = Object.assign({}, this.state.userInput);
        userInput[event.target.name] = event.target.value;
        this.setState({ userInput });
    }
    onTextChangeUpper(event) {
        let userInput = Object.assign({}, this.state.userInput);
        event.target.value = event.target.value.toUpperCase();
        userInput[event.target.name] = event.target.value.toUpperCase();
        this.setState({ userInput });
    }
    handleValidation() {
        let userInput = this.state.userInput;
        let errors = this.state.errors;
        errors["firstName"] = "";
        errors["lastName"] = "";
        errors["email"] = "";
        errors["password"] = "";
        errors["confirmPassword"] = "";

        let formIsValid = true;

        //FirstName
        if (!userInput.firstName) {
            formIsValid = false;
            errors["firstName"] = "First name cannot be empty ";
        }
        if (typeof userInput.firstName !== "undefined" && !errors["firstName"]) {
            if (!userInput.firstName.match(/^[-a-zA-Z',. ]+$/)) {
                formIsValid = false;
                errors["firstName"] = "First name has invalid character";
            }
        }
        //LastName
        if (!userInput.lastName) {
            formIsValid = false;
            errors["lastName"] = "Last name cannot be empty ";
        }
        if (typeof userInput.lastName !== "undefined" && !errors["lastName"]) {
            if (!userInput.lastName.match(/^[-a-zA-Z',. ]+$/)) {
                formIsValid = false;
                errors["lastName"] = "Last name has invalid character";
            }
        }
        //Email
        if (!userInput.email) {
            formIsValid = false;
            errors["email"] = "Email cannot be empty";
        }
        var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        if (!re.test(userInput.email)) {
            formIsValid = false;
            errors["email"] = "Invalid E-mail address";
        }
        //Password
        if (!userInput.password) {
            formIsValid = false;
            errors["password"] = "Password cannot be empty";
        }
        if (!userInput.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) && !errors["password"]) {
            formIsValid = false;
            errors["password"] = "Password must have atleast 8 - 30 characters, atleast 1 uppercase, lowercase and a special character"
        }
        if (userInput.password != userInput.confirmPassword && !errors["password"]) {
            formIsValid = false;
            errors["password"] = "Password does not match";
            errors["confirmPassword"] = "Password does not match"
        }
        this.setState({ errors: errors });
        return formIsValid;
    }
    registerUser() {
        return fetch('http://artlertestingapi.azurewebsites.net/api/Users/Register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: this.state.userInput.firstName,
                lastName: this.state.userInput.lastName,
                email: this.state.userInput.email,
                password: this.state.userInput.password
            })
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.clearFields();
                toastr('Registration successful', 'success', this.refs.notificationSystem);
                setTimeout(() => {
                    this.context.router.push('/user/login');
                }, 500);

            })
            .catch(error => {
                toastr(error.message, 'error', this.refs.notificationSystem);
                console.error(error);
            });
    }
    onSubmit() {
        if (this.handleValidation()) {
            this.registerUser();
        } else {
            // toastr.error("Please fill all fields properly");
            toastr('Please fill all fields properly', 'error', this.refs.notificationSystem);
        }
    }
    clearFields() {
        this.setState({
            userInput: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            errors: {},
            isChecked: false
        });
    }
    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_FLUID,
            sidebarEnabled: false,
            navbarEnabled: false,
            footerEnabled: false,
            headerEnabled: false
        }
    }
    render() {
        return (
            <Row>
                <Col lg={12}>
                    {/* <Button className='m-t-2 m-b-1' onClick={() => this.props.history.goBack()}>
                        <i className='fa fa-angle-left m-r-1'></i>
                        Back
                    </Button> */}
                    <br /><br />
                    <Row>
                        <Col className={classes.centerCol} md={6}>
                            <Panel
                                className={classes.registerPanel}
                                header={(
                                    <Link to='/' className={classes.toHomeLink}>
                                        <img src={logo} width='155px' height='30px' alt='Back to Home' />
                                    </Link>
                                )}
                                footer={(
                                    <div>
                                        <Link to='/forgot-password'>
                                            Forgot Password?
                                        </Link>
                                        <Link to='/user/login' className='pull-right'>
                                            Login
                                        </Link>
                                    </div>
                                )}
                            >
                                <h2 className={classes.panelHeader}>
                                    Register
                                </h2>
                                <p className='text-center m-b-3'>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit
                                </p>

                                {/* <Form onSubmit={e => e.preventDefault()}> */}
                                <Form action=''>
                                    <FormGroup>
                                        <div className={this.state.errors.firstName ? "form-group has-error has-feedback" : "form-group "}>
                                            <label>
                                                First Name
                                            </label>
                                            <FormControl type='text' placeholder='Enter first name...' name='firstName' onChange={this.onTextChangeUpper} required />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.firstName}</span>
                                    </FormGroup>
                                    <FormGroup>
                                        <div className={this.state.errors.lastName ? "form-group has-error has-feedback" : "form-group "}>
                                            <label>
                                                Last Name
                                            </label>
                                            <FormControl type='text' placeholder='Enter last name..' name='lastName' onChange={this.onTextChangeUpper} required />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.lastName}</span>
                                    </FormGroup>
                                    <FormGroup>
                                        <div className={this.state.errors.email ? "form-group has-error has-feedback" : "form-group "}>
                                            <label>
                                                Email Address
                                            </label>
                                            <FormControl type='email' placeholder='Enter valid email address...' name='email' onChange={this.onTextChange} required />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.email}</span>
                                    </FormGroup>
                                    <FormGroup>
                                        <div className={this.state.errors.password ? "form-group has-error has-feedback" : "form-group "}>
                                            <label>
                                                Password
                                        </label>
                                            <FormControl type='password' name='password' onChange={this.onTextChange} required placeholder='Enter password...' />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.password}</span>
                                    </FormGroup>
                                    <FormGroup>
                                        <div className={this.state.errors.confirmPassword ? "form-group has-error has-feedback" : "form-group "}>
                                            <label>
                                                Repeat Password
                                        </label>
                                            <FormControl type='password' name='confirmPassword' onChange={this.onTextChange} required placeholder='Retype the password...' />
                                        </div>
                                        <span className="label label-danger">{this.state.errors.confirmPassword}</span>
                                    </FormGroup>
                                    <Checkbox checked={this.state.isChecked} onChange={() => this.setState({ isChecked: !this.state.isChecked })}>
                                        Accept Terms & Privacy Policy
                                    </Checkbox>

                                    {/* <FormControl block bsStyle='primary' className='btn btn-primary m-b-2' type='submit' value='Register' /> */}
                                    <Button block bsStyle='primary' className='m-b-2' onClick={this.onSubmit} disabled={!this.state.isChecked}>
                                        Register
                                    </Button>
                                    <NotificationSystem ref="notificationSystem" />
                                </Form>
                            </Panel>
                            <p className='text-center text-gray-light'>
                                <strong>
                                    <span className='text-gray-light'> © 2017 Copyright Artler Capital, Inc.</span>
                                </strong>
                            </p>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    usersResult: state.usersResult
});
const mapActionCreators = {
    registerUser
};
export default connect(mapStateToProps, mapActionCreators)(RegisterContainer);
