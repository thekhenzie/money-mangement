import React from 'react';
import {
    Row,
    Col,
    Editor,
    Table,
    Divider,
    Button,
    Modal,
    OverlayTrigger,
    FormControl,
    ColorPicker,
    FormGroup
} from 'components';
import Select from 'react-select';
import { RoutedComponent, connect } from 'routes/routedComponent';
import { CONTENT_VIEW_STATIC } from 'layouts/DefaultLayout/modules/layout';
import { BootstrapTable, TableHeaderColumn } from 'components/ReactTable';
import { createRuleEngine } from './rulesEngine';
import NotificationSystem from 'react-notification-system';
import { toastr } from '../../../utils/toastr';
import store from '../../../store/store';
import { retrieveLoggedUser } from '../../../auth';
import { products } from 'routes/Tables/ReactTables/utils';
class RulesEngineContainer extends RoutedComponent {
    constructor(props) {
        super(props);

        this.state = {
            ruleSetInput: {
                capital: 0,
                contingency: 0,
                bills: 0,
                spending: '',
                lowerLimit: 0,
                upperLimit: 0,
                name: ''
            },
            errors: {},
            ruleSets: {},
            showModal: false,
            selectedValue: {
                label: 'Default',
                value: '3'
            },
            selectedRuleSet: {},
            selectedRuleSetInput: {},
            isEditing: false,
            isEditingLegend: false,
            isViewing: false,
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.onTextChangeEdit = this.onTextChangeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.clearFields = this.clearFields.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }
    componentDidMount() {
        this.retrieveAllRuleSet();
        this.retrieveRuleSet('3');
    }
    onTextChange(event) {
        let ruleSetInput = Object.assign({}, this.state.ruleSetInput);
        ruleSetInput[event.target.name] = event.target.value;
        this.setState({ ruleSetInput });
    }
    onTextChangeEdit(event) {
        let selectedRuleSetInput = Object.assign({}, this.state.selectedRuleSetInput);
        selectedRuleSetInput[event.target.name] = event.target.value;
        this.setState({ selectedRuleSetInput });
    }
    onSelectChange(event) {
        this.setState({ selectedValue: event, isEditing: false });
        this.clearFields();
        this.retrieveRuleSet(event.value);
    }
    onSubmit() {
        if (this.handleValidation(false)) {
            this.createRuleSet();
        } else {
            toastr('Please fill all fields properly', 'error', this.refs.notificationSystem);
        }
    }
    onSave() {
        if (this.handleValidation(true)) {
            this.updateRuleSet();
        } else {
            toastr('Please fill all fields properly', 'error', this.refs.notificationSystem);
        }
    }
    handleValidation(isEditing) {
        let ruleSetInput = isEditing ? this.state.selectedRuleSetInput : this.state.ruleSetInput;
        let errors = this.state.errors;
        errors["capital"] = "";
        errors["contingency"] = "";
        errors["bills"] = "";
        errors["spending"] = "";
        errors["lowerLimit"] = "";
        errors["upperLimit"] = "";
        errors["name"] = "";

        let formIsValid = true;

        //Capital
        if (!ruleSetInput.capital) {
            formIsValid = false;
            errors["capital"] = "Capital cannot be empty ";
        }
        //Contingency
        if (!ruleSetInput.contingency) {
            formIsValid = false;
            errors["contingency"] = "Contingency cannot be empty ";
        }
        //Bills
        if (!ruleSetInput.bills) {
            formIsValid = false;
            errors["bills"] = "Bills cannot be empty";
        }
        //Spending
        if (!ruleSetInput.spending) {
            formIsValid = false;
            errors["spending"] = "Spending cannot be empty";
        }
        debugger;
        let ctr = 0;
        let tempSpending = ruleSetInput.spending.replace(/\s+/, "").split(',');
        tempSpending.forEach(num => {
            ctr += Number(num);
        });
        if (ctr != 7) {
            formIsValid = false;
            errors["spending"] = "Spending ratio is invalid";
        }
        //LowerLimit
        if (!ruleSetInput.lowerLimit) {
            formIsValid = false;
            errors["lowerLimit"] = "Lower limit cannot be empty ";
        }
        //upperLimit
        if (!ruleSetInput.upperLimit) {
            formIsValid = false;
            errors["upperLimit"] = "Upper Limit cannot be empty";
        }
        //name
        if (!ruleSetInput.name) {
            formIsValid = false;
            errors["name"] = "Name cannot be empty";
        }

        this.setState({ errors: errors });
        return formIsValid;
    }
    updateRuleSet() {
        let loggedUser = retrieveLoggedUser();
        return fetch(`http://artlertestingapi.azurewebsites.net/api/RuleSets/${this.state.selectedRuleSet.ruleSetID}?adminID=${loggedUser.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            },
            body: JSON.stringify({
                ruleSetID: Number(this.state.selectedRuleSet.ruleSetID),
                capital: Number(this.state.selectedRuleSetInput.capital),
                contingency: Number(this.state.selectedRuleSetInput.contingency),
                bills: Number(this.state.selectedRuleSetInput.bills),
                lowerLimit: Number(this.state.selectedRuleSetInput.lowerLimit),
                upperLimit: Number(this.state.selectedRuleSetInput.upperLimit),
                spending: this.state.selectedRuleSetInput.spending,
                name: this.state.selectedRuleSetInput.name,
                userID: loggedUser.id,
                spending: this.state.selectedRuleSetInput.spending,
                status: 1
            })
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.clearFields();
                this.setState({
                    isEditing: false,
                    isEditingLegend: false,
                    selectedRuleSet: responseJSON
                });
                toastr('Rule-Set updated', 'success', this.refs.notificationSystem);
                setTimeout(() => {
                }, 500);
            })
            .catch(error => {
                toastr(error.message, 'error', this.refs.notificationSystem);
                console.log(error);
            });
    }
    createRuleSet() {
        let loggedUser = retrieveLoggedUser();
        return fetch(`http://artlertestingapi.azurewebsites.net/api/RuleSets?adminID=${loggedUser.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            },
            body: JSON.stringify({
                capital: Number(this.state.ruleSetInput.capital),
                contingency: Number(this.state.ruleSetInput.contingency),
                bills: Number(this.state.ruleSetInput.bills),
                lowerLimit: Number(this.state.ruleSetInput.lowerLimit),
                upperLimit: Number(this.state.ruleSetInput.upperLimit),
                spending: this.state.ruleSetInput.spending,
                name: this.state.ruleSetInput.name,
                userID: loggedUser.id,
                status: 1
            })
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                this.clearFields();
                toastr('Rule-Set added', 'success', this.refs.notificationSystem);
                setTimeout(() => {
                }, 500);
            })
            .catch(error => {
                toastr(error.message, 'error', this.refs.notificationSystem);
                console.log(error);
            });
    }
    retrieveAllRuleSet() {
        let loggedUser = retrieveLoggedUser();
        return fetch(`http://artlertestingapi.azurewebsites.net/api/RuleSets?adminID=${loggedUser.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            }
        })
            .then(response => response.json())
            .then(responseJSON => {
                this.setState({
                    ruleSets:
                        responseJSON.result.map((x) => ({
                            ruleSetID: x.ruleSetID,
                            capital: x.capital,
                            contingency: x.contingency,
                            bills: x.bills,
                            lowerLimit: x.lowerLimit,
                            upperLimit: x.upperLimit,
                            userID: x.userID,
                            user: x.user,
                            name: x.name,
                            spending: x.spending,
                            status: x.status
                        }))
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
    retrieveRuleSet(value) {
        let loggedUser = retrieveLoggedUser();
        return fetch(`http://artlertestingapi.azurewebsites.net/api/RuleSets/${value}?adminID=${loggedUser.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${loggedUser.token}`
            }
        })
            .then(response => response.json())
            .then(responseJSON => {
                this.setState({
                    selectedRuleSet: {
                        ruleSetID: responseJSON.ruleSetID,
                        capital: responseJSON.capital,
                        contingency: responseJSON.contingency,
                        bills: responseJSON.bills,
                        lowerLimit: responseJSON.lowerLimit,
                        upperLimit: responseJSON.upperLimit,
                        userID: responseJSON.userID,
                        user: responseJSON.user,
                        name: responseJSON.name,
                        spending: responseJSON.spending,
                        status: responseJSON.status
                    },
                    selectedRuleSetInput: {
                        capital: responseJSON.capital,
                        contingency: responseJSON.contingency,
                        bills: responseJSON.bills,
                        lowerLimit: responseJSON.lowerLimit,
                        upperLimit: responseJSON.upperLimit,
                        userID: responseJSON.userID,
                        name: responseJSON.name,
                        spending: responseJSON.spending,
                        status: responseJSON.status
                    }
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
    clearFields() {
        this.setState({
            ruleSetInput: {
                capital: 0,
                contingency: 0,
                bills: 0,
                spending: '',
                lowerLimit: 0,
                upperLimit: 0,
                name: ''
            },
            errors: {},
            isEditing: false,
            isEditingLegend: false,
            showModal: false
        });
    }
    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_STATIC
        }
    }
    render() {
        this.retrieveAllRuleSet();
        let options = [];
        if (this.state.ruleSets[0] != null) {
            this.state.ruleSets.map((rs) =>
                options.push({ value: rs.ruleSetID + '', label: rs.name + '' }));
        }
        const data = Array.from(products(['id', 'name', 'price', 'inStockDate'], 100));
        return (

            <Row>
                {this.state.isViewing ?
                    <div>
                        <Col lg={2}>
                            <Button bsStyle='primary' onClick={() => this.setState({ isViewing: false })}><i className='fa fa-arrow-left'></i> Back to Rules Engine</Button>
                        </Col>
                        <br /><br /><br />
                        <Col lg={12}>
                            <BootstrapTable className='custom-scrollbar' data={data} bordered={false} height='500' scrollTop={'Top'}>
                                <TableHeaderColumn dataField='id' isKey={true} dataSort={true}>ITEMS</TableHeaderColumn>
                                <TableHeaderColumn dataField='name' dataSort={true}>ACTIVITY</TableHeaderColumn>
                                <TableHeaderColumn dataField='price'>DESCRIPTION</TableHeaderColumn>
                                <TableHeaderColumn dataField='inStockDate' dataSort={true}>DATE</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </div> :
                    <Col lg={12}>
                        <Row>
                            <Col lg={1} className='p-r-0 p-t-1'>
                                Rule Name
                            </Col>
                            <Col lg={3}>
                                <Select options={options} onChange={this.onSelectChange} value={this.state.selectedValue} clearable={false} />
                            </Col>
                            <Col lg={4}>
                            </Col>
                            <Col lg={2}>
                                <Button bsStyle='success' block onClick={() => this.setState({ showModal: true })}><i className='fa fa-plus-circle'></i> Add Rule-Set</Button>
                            </Col>
                            <Col lg={2} className='p-l-0'>
                                <Button bsStyle='primary' block onClick={() => this.setState({ isViewing: true })}><i className='fa fa-eye'></i> View Rule-Set Logs</Button>
                            </Col>
                        </Row>
                        <Row className='m-t-2'>
                            <Col lg={8}>
                                {this.state.isEditing ?
                                    <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                                        <Button bsStyle='success' className='m-r-2' onClick={() => this.onSave()}><i className='fa fa-save' /> Save</Button>
                                        <a className='text-danger' onClick={() => this.setState({ isEditing: false, errors: {} })}>
                                            <i className='fa fa-ban' /> Cancel
                                </a>
                                    </div> :
                                    <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                                        <a onClick={() => this.setState({ isEditing: true, selectedRuleSetInput: this.state.selectedRuleSet })}>
                                            <i className='fa fa-pencil'></i> Edit
                                </a>
                                    </div>
                                }

                                <Divider>
                                    Rules Settings
                                </Divider>
                                <Table className='v-a-m' hover>
                                    <thead>
                                        <tr>
                                            <th>RULES</th>
                                            <th>SPLIT</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Capital Deposit</td>
                                            <td className='text-white v-a-m'>
                                                {this.state.isEditing ?
                                                    <div>
                                                        <div className={this.state.errors.capital ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormControl className='m-b-0' type='number' step='any' min='0' placeholder='Input %' name='capital' onChange={this.onTextChangeEdit} value={this.state.selectedRuleSetInput.capital} required />
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.capital}</span>
                                                    </div> :
                                                    this.state.selectedRuleSet.capital
                                                }
                                            </td>
                                            <td>of Salary</td>
                                        </tr>
                                        <tr>
                                            <td>Contingency</td>
                                            <td className='text-white v-a-m'>
                                                {this.state.isEditing ?
                                                    <div>
                                                        <div className={this.state.errors.contingency ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='contingency' onChange={this.onTextChangeEdit} value={this.state.selectedRuleSetInput.contingency} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.contingency}</span>
                                                    </div> :
                                                    this.state.selectedRuleSet.contingency
                                                }
                                            </td>
                                            <td>of Salary</td>
                                        </tr>
                                        <tr>
                                            <td>Bills</td>
                                            <td className='text-white v-a-m'>
                                                {this.state.isEditing ?
                                                    <div>
                                                        <div className={this.state.errors.bills ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='bills' onChange={this.onTextChangeEdit} value={this.state.selectedRuleSetInput.bills} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.bills}</span>
                                                    </div> :
                                                    this.state.selectedRuleSet.bills
                                                }
                                            </td>
                                            <td>Table cell</td>
                                        </tr>
                                        <tr>
                                            <td>Spending</td>
                                            <td className='text-white v-a-m'>
                                                {this.state.isEditing ?
                                                    <div>
                                                        <div className={this.state.errors.spending ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='text' placeholder='Input #Days' name='spending' onChange={this.onTextChangeEdit} value={this.state.selectedRuleSetInput.spending} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.spending}</span>
                                                    </div> :
                                                    this.state.selectedRuleSet.spending
                                                }
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col lg={4}>
                                <div className='pull-right'> Edit </div>
                                <Divider>
                                    Configuration
                                </Divider>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>RULES</th>
                                            <th>SPLIT</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Table cell</td>
                                            <td>Table cell</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Table cell</td>
                                            <td>Table cell</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Table cell</td>
                                            <td>Table cell</td>
                                        </tr>
                                        <tr>
                                            <td>of Salary</td>
                                            <td>of Salary</td>
                                            <td>of Bills</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className='m-t-2'>
                            <Col lg={8}>
                                {this.state.isEditingLegend ?
                                    <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                                        <Button bsStyle='success' className='m-r-2' onClick={() => this.onSave()}><i className='fa fa-save' /> Save</Button>
                                        <a className='text-danger' onClick={() => this.setState({ isEditingLegend: false, errors: {} })}>
                                            <i className='fa fa-ban' /> Cancel
                            </a>
                                    </div> :
                                    <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                                        <a onClick={() => this.setState({ isEditingLegend: true, selectedRuleSetInput: this.state.selectedRuleSet })}>
                                            <i className='fa fa-pencil'></i> Edit
                            </a>
                                    </div>
                                }

                                <Divider>
                                    LEGEND
                    </Divider>
                                <Table className='v-a-m' hover>
                                    <thead>
                                        <tr>
                                            <th>DESCRIPTION</th>
                                            <th>RANGE</th>
                                            <th>COLOR CODE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Healthy Transaction</td>
                                            <td className='text-white v-a-m'>
                                                {this.state.isEditingLegend ?
                                                    <div>
                                                        <div className={this.state.errors.lowerLimit ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='lowerLimit' onChange={this.onTextChangeEdit} value={this.state.selectedRuleSetInput.lowerLimit} required />
                                                            </FormGroup >
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.lowerLimit}</span>
                                                    </div> :
                                                    <div>&lt;{this.state.selectedRuleSet.lowerLimit} %</div>
                                                }
                                            </td>
                                            <td><div className='bg-success' style={{ width: '30px', height: '30px' }}></div></td>
                                        </tr>
                                        <tr>
                                            <td>Slow down spending</td>
                                            <td className='text-white v-a-m'>
                                                {this.state.isEditingLegend ?
                                                    <div>{this.state.selectedRuleSetInput.lowerLimit}-{this.state.selectedRuleSetInput.upperLimit}%</div>
                                                    :
                                                    <div>{this.state.selectedRuleSet.lowerLimit}-{this.state.selectedRuleSet.upperLimit}%</div>
                                                }

                                            </td>
                                            <td><div className='bg-warning' style={{ width: '30px', height: '30px' }}></div></td>
                                        </tr>
                                        <tr>
                                            <td>Almost reached limit</td>
                                            <td className='text-white v-a-m'>
                                                {this.state.isEditingLegend ?
                                                    <div>
                                                        <div className={this.state.errors.upperLimit ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='upperLimit' onChange={this.onTextChangeEdit} value={this.state.selectedRuleSetInput.upperLimit} required />
                                                            </FormGroup >
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.upperLimit}</span>
                                                    </div> :
                                                    <div>>{this.state.selectedRuleSet.upperLimit}</div>
                                                }
                                            </td>
                                            <td><div className='bg-danger' style={{ width: '30px', height: '30px' }}></div></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col lg={4}>
                                <div className='pull-right'> Edit </div>
                                <Divider>
                                    Money management Score
                    </Divider>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>DESCRIPTION</th>
                                            <th>CODE</th>
                                            <th>SCORE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Formula</td>
                                            <td className='text-white'>TBC</td>
                                            <td className='text-white'>Between 1-1000</td>
                                        </tr>
                                        <tr>
                                            <td>Bias</td>
                                            <td className='text-white'>0</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Col>
                }
                <Modal
                    bsSize='large'
                    show={this.state.showModal}
                    onHide={this.clearFields}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add Rule-Set</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                        <Row>
                            <Col lg={12}>
                                <Row>
                                    <Col lg={6}>
                                        Rule Name
                                        <div className={this.state.errors.name ? "form-group has-error has-feedback" : "form-group "}>
                                            <FormGroup className='m-b-0'>
                                                <FormControl type='text' placeholder='Input name' className='m-t-1' name='name' onChange={this.onTextChange} required />
                                            </FormGroup>
                                        </div>
                                        <span className="label label-danger">{this.state.errors.name}</span>
                                    </Col>
                                    <Col lg={6}>
                                    </Col>
                                </Row>
                                <Divider className='m-t-1'>
                                    Rules
                                </Divider>
                                <Row>
                                    <Col lg={6}>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>DIVISIONS</th>
                                                    <th>INCOME SPLIT</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Capital</td>
                                                    <td>
                                                        <div className={this.state.errors.capital ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='capital' onChange={this.onTextChange} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.capital}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Contingency</td>
                                                    <td>
                                                        <div className={this.state.errors.contingency ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='contingency' onChange={this.onTextChange} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.contingency}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Bills</td>
                                                    <td>
                                                        <div className={this.state.errors.bills ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='bills' onChange={this.onTextChange} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.bills}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Spending</td>
                                                    <td>
                                                        <div className={this.state.errors.spending ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl type='text' placeholder='Input #Days' name='spending' onChange={this.onTextChange} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.spending}</span></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col lg={6}>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>LIMIT</th>
                                                    <th>RANGE</th>
                                                    <th>COLOR CODE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Lower Limit</td>
                                                    <td>
                                                        <div className={this.state.errors.lowerLimit ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl className='m-b-0' type='number' step='any' min='0' placeholder='Input %' name='lowerLimit' onChange={this.onTextChange} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.lowerLimit}</span>
                                                    </td>
                                                    <td><div className='bg-success' style={{ width: '30px', height: '30px' }}></div></td>
                                                </tr>
                                                <tr>
                                                    <td>Middle Limit</td>
                                                    <td className='text-white'>
                                                        {this.state.ruleSetInput.lowerLimit}-{this.state.ruleSetInput.upperLimit}%
                                                    </td>
                                                    <td><div className='bg-warning' style={{ width: '30px', height: '30px' }}></div></td>
                                                </tr>
                                                <tr>
                                                    <td>Upper Limit</td>
                                                    <td>
                                                        <div className={this.state.errors.upperLimit ? "form-group has-error has-feedback" : "form-group "}>
                                                            <FormGroup className='m-b-0'>
                                                                <FormControl className='m-b-0' type='number' step='any' min='0' placeholder='Input %' name='upperLimit' onChange={this.onTextChange} required />
                                                            </FormGroup>
                                                        </div>
                                                        <span className="label label-danger">{this.state.errors.upperLimit}</span>
                                                    </td>
                                                    <td><div className='bg-danger' style={{ width: '30px', height: '30px' }}></div></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>

                                </Row>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer >
                        <div style={{ textAlign: 'center' }}>
                            <Button bsStyle="success" onClick={this.onSubmit} ><i className='fa fa-save'></i> Save New Rule</Button>
                        </div>
                    </Modal.Footer>
                </Modal>
                <NotificationSystem ref="notificationSystem" />

            </Row >


        );
    }
}

export default connect()(RulesEngineContainer);
