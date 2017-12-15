import React from 'react';
import {
    Row,
    Col,
    Divider,
    Button,
    Table,
    FormControl,
    FormGroup,
    InputGroup
} from 'components';

import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_STATIC } from 'layouts/DefaultLayout/modules/layout';
import { retrieveLoggedUser } from '../../../auth';
import NotificationSystem from 'react-notification-system';
import { toastr } from '../../../utils/toastr';
//import classes from './../Pages.scss';
var ctr = 0;
class FinancialsContainer extends RoutedComponent {
    constructor(props) {
        super(props);

        this.state = {
            statementInput: {
                income: 0.0
            },
            selectedStatement: {},
            billsInput: [],
            selectedBills: [],
            selectedBillsRow: [],
            errors: {},
            isEditing: false,
            isBillEditing: false,
            isAdding: false,
            errors: {}
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onSaveStatement = this.onSaveStatement.bind(this);
        this.updateStatement = this.updateStatement.bind(this);
        this.onAddRow = this.onAddRow.bind(this);
        this.onRemoveRow = this.onRemoveRow.bind(this);
        this.onTextChangeBills = this.onTextChangeBills.bind(this);
    }
    componentDidMount() {
        this.retrieveStatement();
    }
    retrieveStatement() {
        debugger;
        let loggedUser = retrieveLoggedUser();
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;

        return fetch(`http://artlertestingapi.azurewebsites.net/api/Statements?adminID=31`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            }
        })
            .then(response => response.json())
            .then(responseJSON => {
                debugger;
                let selectedStatement = responseJSON.result.find(x => {
                    return x.month == month && x.year == year && x.userID == loggedUser.id;
                });
                this.setState({ selectedStatement });
                this.retrieveBill();
                // console.log(selectedStatement);
                // selectedStatement == undefined ? this.createStatement() : this.setState({ selectedStatement });
            })
            .catch(error => {
                console.error(error);
            });
    }
    createStatement() {
        debugger;
        let loggedUser = retrieveLoggedUser();
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        return fetch(`http://artlertestingapi.azurewebsites.net/api/Statements`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            },
            body: JSON.stringify({
                userID: Number(loggedUser.id),
                income: 0,
                month: Number(month),
                year: Number(year)
            })
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({ selectedStatement: responseJSON.result });
            })
            .catch(error => {
                console.log(error);
            });
    }
    updateStatement() {
        debugger;
        let loggedUser = retrieveLoggedUser();
        let year = new Date().getFullYear();
        let month = new Date().getMonth();
        return fetch(`http://artlertestingapi.azurewebsites.net/api/Statements/${this.state.selectedStatement.statementID}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            },
            body: JSON.stringify({
                statementID: this.state.selectedStatement.statementID,
                userID: Number(loggedUser.id),
                income: this.state.statementInput.income,
                month: Number(month),
                year: Number(year)
            })
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({
                    isEditing: false,
                    selectedRuleSet: responseJSON.result
                });
                toastr('Income updated', 'success', this.refs.notificationSystem);
                setTimeout(() => {
                }, 500);
            })
            .catch(error => {
                toastr(error.message, 'error', this.refs.notificationSystem);
                console.log(error);
            });
    }
    retrieveBill() {
        debugger;
        let loggedUser = retrieveLoggedUser();
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;

        return fetch(`http://artlertestingapi.azurewebsites.net/api/Bills/GetByStatementID/${this.state.selectedStatement.statementID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            }
        })
            .then(response => response.json())
            .then(responseJSON => {
                this.setState({ selectedBills: responseJSON.result });
            })
            .catch(error => {
                console.error(error);
            });
    }
    createBill() {
        let loggedUser = retrieveLoggedUser();
        return fetch(`http://artlertestingapi.azurewebsites.net/api/Bills/PostMany`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            },
            body: JSON.stringify([
                {
                    userID: Number(loggedUser.id),
                    income: 0,
                    month: Number(month),
                    year: Number(year)
                }
            ])
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.setState({ selectedStatement: responseJSON.result });
            })
            .catch(error => {
                console.log(error);
            });
    }
    onTextChange(event) {
        let billsInput = Object.assign({}, this.state.billsInput);
        billsInput[event.target.name] = event.target.value;
        this.setState({ statementInput });
    }
    onTextChangeBills(event) {
        debugger;
        let statementInput = Object.assign({}, this.state.statementInput);
        statementInput[event.target.name] = event.target.value;
        this.setState({ statementInput });
    }
    onSaveStatement() {
        debugger;
        if (this.handleValidation(false)) {
            this.updateStatement();
        } else {
            toastr('Please fill all fields properly', 'error', this.refs.notificationSystem);
        }
    }
    handleValidation(isEditing) {
        debugger;
        let statementInput = isEditing ? this.state.selectedStatement : this.state.statementInput;
        let errors = this.state.errors;
        errors["income"] = "";


        let formIsValid = true;

        //Income
        if (!statementInput.income) {
            formIsValid = false;
            errors["income"] = "Income cannot be empty ";

            this.setState({ errors: errors });
            return formIsValid;
        }
    }
    onAddRow() {
        ctr += 1;
        // this.setState({ isAdding: true });
        let selectedBillsRow = this.state.selectedBillsRow;
        selectedBillsRow.push(<tr key={ctr}>
            <td><FormControl type='text' name='name' required /></td>
            <td className='v-a-m' id={ctr}>
                <FormGroup className='m-b-0'>
                    <InputGroup>
                        <InputGroup.Addon>$</InputGroup.Addon>
                        <FormControl type="text" name='amount' onChange={this.onTextChangeBills} />
                    </InputGroup>
                </FormGroup>
            </td>
            <td id={ctr}>
                &nbsp;<i className='fa fa-close' id={ctr} onClick={this.onRemoveRow}></i>
            </td>
        </tr>);
        this.setState({ selectedBillsRow });
    }
    onRemoveRow(event) {
        let selectedBillsRow = this.state.selectedBillsRow;
        let index = selectedBillsRow.findIndex(k => k.key == event.target.id);
        selectedBillsRow.splice(index, 1);
        this.setState({ selectedBillsRow });
    }
    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_STATIC
        }
    }
    render() {
        let rows = []
        this.state.selectedBills[0] != null ?
            this.state.selectedBills.map(r => {
                rows.push(<tr>
                    <td className='text-white'>{r.name}</td>
                    <td className='text-white'>$ {r.amount}</td>
                </tr>)
            }) : <tr><td>No bills yet</td><td></td></tr>;

        return (
            <Row>
                <Col lg={8}>
                    {this.state.isEditing ?
                        <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                            <Button bsStyle='success' className='m-r-2' onClick={() => this.updateStatement()}><i className='fa fa-save' /> Save</Button>
                            <a className='text-danger' onClick={() => this.setState({ isEditing: false, errors: {} })}>
                                <i className='fa fa-ban' /> Cancel
                        </a>
                        </div> :
                        <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                            <a onClick={() => this.setState({ isEditing: true, statementInput: { income: this.state.selectedStatement.income } })}>
                                <i className='fa fa-pencil'></i> Edit
                        </a>
                        </div>
                    }

                    <Divider >
                        <div className='text-white'>Your Net Income</div>
                    </Divider>
                    {this.state.isEditing ?
                        <div>
                            <div className={this.state.errors.income ? "form-group has-error has-feedback" : "form-group "}>
                                <FormGroup className='m-b-0'>
                                    <FormControl type='number' step='any' min='0' placeholder='Input %' name='income' onChange={this.onTextChange} value={this.state.statementInput.income} required />
                                </FormGroup>
                            </div>
                            <span className="label label-danger">{this.state.errors.income}</span>
                            <br />
                        </div>
                        : <h1 className='text-mint-green'>$ {this.state.selectedStatement.income == undefined ? '0' : this.state.selectedStatement.income}</h1>
                    }


                    <hr />
                    <div className='text-white'>YOUR TOTAL BILLS</div><br />
                    <Button bsStyle='primary' onClick={() => this.onAddRow()}>Add bill</Button>
                    <Row>
                        <Col lg={12}>
                            <br />
                            <div className='m-t-4 m-b-4 bg-gray b-a-2 b-dashed b-gray-light'>
                                <div className='p-a-4'>Subtotal<br />
                                    Contengency</div>
                            </div>
                            <br />
                        </Col>
                    </Row>

                    {this.state.isBillEditing ?
                        <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                            <Button bsStyle='success' className='m-r-2' onClick={() => this.onSave()}><i className='fa fa-save' /> Save</Button>
                            <a className='text-danger' onClick={() => this.setState({ isBillEditing: false, errors: {} })}>
                                <i className='fa fa-ban' /> Cancel
                        </a>
                        </div> :
                        <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                            <a onClick={() => this.setState({ isBillEditing: true })}>
                                <i className='fa fa-pencil'></i> Edit
                        </a>
                        </div>
                    }
                    <Divider>
                        <div className='text-white'>Bill Details</div>
                    </Divider>
                    <Table className='v-a-m' hover>
                        <thead>
                            <tr>
                                <th>DESCRIPTION</th>
                                <th>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                            {this.state.selectedBillsRow}
                            {this.state.isAdding ?
                                null
                                : null}
                        </tbody>
                    </Table>
                    <Button bsStyle='success'>Save New Bill</Button>
                </Col>
                <NotificationSystem ref="notificationSystem" />
            </Row>
        );
    }
}

export default connect()(FinancialsContainer);
