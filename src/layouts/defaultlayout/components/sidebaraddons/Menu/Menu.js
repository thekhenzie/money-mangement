import React from 'react';
import {
    Media
} from 'react-bootstrap';
import faker from 'faker';
import { Link } from 'react-router';
import Select from 'react-select';
import {
    AvatarImage,
    Sidebar
} from 'components';

import moment from 'moment';
import SingleDatePickerWrapper from '../../../../../routes/Forms/DateRangePicker/components/SingleDatePickerWrapper';
// import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/lib/css/react_dates_overrides.css';
import avatarImage from 'static/avatars/avatar-28.jpg';
import { Colors } from 'consts';
import store from '../../../../../store/store';
import { retrieveLoggedUser } from '../../../../../auth';
class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ruleSets: {},
            selectedValue: {
                label: 'Default',
                value: '3'
            },
            value: null
        }
        this.onSelectChange = this.onSelectChange.bind(this);
    }
    componentDidMount() {
        this.retrieveAllRuleSet();
    }
    onSelectChange(event) {
        this.setState({ selectedValue: event });
    }
    retrieveAllRuleSet() {
        let loggedUser = retrieveLoggedUser();
        let token = loggedUser != null ? loggedUser.token : '';
        let adminID = loggedUser != null ? loggedUser.id : '';
        return fetch(`http://artlertestingapi.azurewebsites.net/api/RuleSets?adminID=${adminID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
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
    render() {
        this.retrieveAllRuleSet();
        let options = [];
        if (this.state.ruleSets[0] != null) {
            this.state.ruleSets.map((rs) =>
                options.push({ value: rs.ruleSetID + '', label: rs.name + '' }));
        }

        let loggedUser = retrieveLoggedUser();
        let userName = (loggedUser == null) ? `` : loggedUser.firstName + ' ' + loggedUser.lastName;
        let income = (loggedUser == null) ? `` : loggedUser.income;
        let isAdmin = (loggedUser == null) ? `` : loggedUser.isAdmin;
        return (
            <Sidebar.AddOn>
                {/*     Default Sidebar     */}
                <Sidebar.AddOnContent supportedStyle='default'>
                    {isAdmin ?
                        //#region Admin
                        <div>
                            <Media>
                                <Media.Left>
                                    <Link to='/users'>
                                        <AvatarImage
                                            src={avatarImage}
                                            showStatus
                                            statusPlacement='bottom'
                                            statusColor={Colors.brandSuccess}
                                            statusBorderColor={this.props.colorSidebar ? '#fff' : Colors.grayDarker}
                                        />
                                    </Link>
                                </Media.Left>
                                <Media.Body>
                                    <Media.Heading
                                        componentClass='h5'
                                        className='m-y-0'
                                    >
                                        JOHN DOE
                            </Media.Heading>
                                    <small>User</small>
                                </Media.Body>
                                <Media.Right align='middle'>
                                    <Link to='/users'>
                                        <i className="fa fa-fw fa-search text-gray-lighter"></i>
                                    </Link>
                                </Media.Right>
                            </Media>
                            <div className='text-center'>
                                <p className='text-light-gray m-t-2 m-b-0 f-s-11'>NET INCOME</p>
                                <h3 className='text-mint-green m-t-0'>$ 1,568</h3>
                            </div>
                            <div className='row m-t-2 p-x-1'>
                                <div className='col-md-7 no-p-l' style={{ paddingLeft: '0px' }}>
                                    {/* <Select
                                        { ...(_.pick(this.state, ['options', 'value'])) }
                                        onChange={val => this.setState({ value: val })}
                                        simpleValue
                                        clearable={false}
                                    /> */}
                                    <Select options={options} onChange={this.onSelectChange} value={this.state.selectedValue} clearable={false} />

                                </div>
                                <div className='col-md-5'>
                                    {/* {() => (<SingleDatePickerWrapper />)} */}
                                    <SingleDatePickerWrapper initialDate={moment()} displayFormat='MM/YYYY'
                                    />
                                </div>
                            </div>
                        </div>
                        //#endregion
                        :
                        //#region User
                        <div >
                            <Media>
                                <Media.Left>
                                    <Link to='/users'>
                                        <AvatarImage
                                            src={avatarImage}
                                            showStatus
                                            statusPlacement='bottom'
                                            statusColor={Colors.brandSuccess}
                                            statusBorderColor={this.props.colorSidebar ? '#fff' : Colors.grayDarker}
                                        />
                                    </Link>
                                </Media.Left>
                                <Media.Body>
                                    <Media.Heading
                                        componentClass='h5'
                                        className='m-y-0'
                                    >
                                        {userName}
                                    </Media.Heading>
                                    <small>User</small>
                                </Media.Body>
                            </Media>
                            <div className='row m-t-3 m-b-0'>
                                <div className='col-md-7'>
                                    <p className='text-light-gray'>NET INCOME: </p>
                                </div>
                                <div className='col-md-5'>
                                    <h4 className='text-mint-green'>$ 1,568</h4>
                                </div>
                            </div>
                            <hr className='hr-5' style={{ marginTop: '5px', marginBottom: '5px' }} />
                            <div className='row'>
                                <div className='col-md-6'>
                                    <p className='text-light-gray'>MONTH: </p>
                                </div>
                                <div className='col-md-6'>
                                    <SingleDatePickerWrapper initialDate={moment()} displayFormat='MM/YYYY' />
                                </div>
                            </div>
                        </div >
                        //#endregion
                    }
                </Sidebar.AddOnContent>
                {/*     Slim Sidebar     */}
                <Sidebar.AddOnContent supportedStyle='big-icons'>
                    <Link to='/apps/profile -details'>
                        <AvatarImage
                            src={avatarImage}
                            showStatus
                            statusPlacement='bottom'
                            statusColor={Colors.brandSuccess}
                            statusBorderColor={this.props.colorSidebar ? '#fff' : Colors.grayDarker}
                            className='m-b-1'
                        />
                    </Link>
                    < p className='text-white m-y-0'>
                        {userName}
                    </p>
                </Sidebar.AddOnContent>
                {/*     BigIcons Sidebar     */}
                <Sidebar.AddOnContent supportedStyle='slim'>
                    <Link to='/apps/profile-details'>
                        <AvatarImage
                            src={avatarImage}
                            showStatus
                            statusPlacement='bottom'
                            statusColor={Colors.brandSuccess}
                            statusBorderColor={this.props.colorSidebar ? '#fff' : Colors.grayDarker}
                            size='small'
                        />
                    </Link>
                </Sidebar.AddOnContent>
            </Sidebar.AddOn>
        );
    }

}
Menu.propTypes = {
    colorSidebar: React.PropTypes.bool
};

export default Menu;
