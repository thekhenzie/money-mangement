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

//import classes from './../Pages.scss';

class FinancialsContainer extends RoutedComponent {
    constructor(props) {
        super(props);

        this.state = {
            input: {
                income: 0.0
            },
            errors: {},
            isEditing: false,
            isBillEditing: false,
            isAdding: false
        };
    }
    onTextChange(event) {
        let input = Object.assign({}, this.state.input);
        input[event.target.name] = event.target.value;
        this.setState({ input });
    }
    getLayoutOptions() {
        return {
            contentView: CONTENT_VIEW_STATIC
        }
    }

    render() {
        return (
            <Row>
                <Col lg={8}>
                    {this.state.isEditing ?
                        <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                            <Button bsStyle='success' className='m-r-2' onClick={() => this.onSave()}><i className='fa fa-save' /> Save</Button>
                            <a className='text-danger' onClick={() => this.setState({ isEditing: false, errors: {} })}>
                                <i className='fa fa-ban' /> Cancel
                        </a>
                        </div> :
                        <div className='pull-right' style={{ zIndex: '2', position: 'relative', cursor: 'pointer' }}>
                            <a onClick={() => this.setState({ isEditing: true })}>
                                <i className='fa fa-pencil'></i> Edit
                        </a>
                        </div>
                    }
                    <Divider >
                        <div className='text-white'>Your Net Income</div>
                    </Divider>
                    <h1 className='text-mint-green'>$1,568</h1>
                    <hr />
                    <div className='text-white'>YOUR TOTAL BILLS</div><br />
                    <Button bsStyle='primary' onClick={() => this.setState({ isAdding: true })}>Add bill</Button>
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
                            <tr>
                                <td>Cellphone</td>
                                <td className='text-white v-a-m'>
                                    {/* {this.state.isEditingLegend ?
                                        <div>
                                            <div className={this.state.errors.lowerLimit ? "form-group has-error has-feedback" : "form-group "}>
                                                <FormControl type='number' step='any' min='0' placeholder='Input %' name='lowerLimit' onChange={this.onTextChangeEdit} value={this.state.selectedRuleSetInput.lowerLimit} required />
                                            </div>
                                            <span className="label label-danger">{this.state.errors.lowerLimit}</span>
                                        </div> :
                                        <div>&lt;{this.state.selectedRuleSet.lowerLimit} %</div>
                                    } */}
                                    $40.00
                                </td>
                            </tr>
                            <tr>
                                <td>Rent</td>
                                <td className='text-white v-a-m'>
                                    {/* {this.state.isEditingLegend ?
                                        <div>{this.state.selectedRuleSetInput.lowerLimit}-{this.state.selectedRuleSetInput.upperLimit}%</div>
                                        :
                                        <div>{this.state.selectedRuleSet.lowerLimit}-{this.state.selectedRuleSet.upperLimit}%</div>
                                    } */}
                                    $400.00
                                </td>
                            </tr>
                            {this.state.isAdding ?
                                <tr>
                                    <td><FormControl type='text' required /></td>
                                    <td className='v-a-m'>
                                        <FormGroup className='m-b-0'>
                                            <InputGroup>
                                                <InputGroup.Addon>$</InputGroup.Addon>
                                                <FormControl type="text" />
                                            </InputGroup>
                                        </FormGroup>
                                    </td>
                                    <td>
                                        &nbsp;<i className='fa fa-close' onClick={() => this.setState({ isAdding: false })}></i>
                                    </td>
                                </tr>
                                : null}
                        </tbody>
                    </Table>
                    <Button bsStyle='success'>Save New Bill</Button>
                </Col>
            </Row>
        );
    }
}

export default connect()(FinancialsContainer);
