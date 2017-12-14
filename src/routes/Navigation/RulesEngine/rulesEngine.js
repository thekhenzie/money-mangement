
// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_ZEN = 'REQUEST_ZEN'
export const RECEIVE_ZEN = 'RECEIVE_ZEN'
export const SAVE_CURRENT_ZEN = 'SAVE_CURRENT_ZEN'
export const CREATE_RULE_ENGINE = 'CREATE_RULE_ENGINE'
export const RETRIEVE_RULE_ENGINE = 'RETRIEVE_RULE_ENGINE'
export const RETRIEVE_RULE_ENGINES = 'RETRIEVE_RULE_ENGINES'
export const UPDATE_RULE_ENGINE = 'UPDATE_RULE_ENGINE'

// ------------------------------------
// Actions
// ------------------------------------
export function requestZen() {
    return {
        type: REQUEST_ZEN
    }
}

let availableid = 0
export function receiveZen(value: string) {
    return {
        type: RECEIVE_ZEN,
        payload: {
            value,
            id: availableid++
        }
    }
}

export function saveCurrentZen() {
    return {
        type: SAVE_CURRENT_ZEN
    }
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export function createRuleEngine(ruleSetInput) {
    debugger;
    return (dispatch) => {
        dispatch({
            type: CREATE_RULE_ENGINE
        })
        return fetch('http://artlertestingapi.azurewebsites.net/api/RuleSets', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                capital: ruleSetInput.capital,
                contingency: ruleSetInput.contingency,
                bills: ruleSetInput.bills,
                lowerLimit: ruleSetInput.lowerLimit,
                upperLimit: ruleSetInput.upperLimit,
                spending: ruleSetInput.spending,
                name: ruleSetInput.name
            })
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                setTimeout(() => {
                    this.context.router.push('/user/login');
                }, 500);

            })
            .catch(error => {
                toastr(error.message, 'error', this.refs.notificationSystem);
                console.error(error);
            });
    }
}
export const fetchZen = () => {
    return (dispatch) => {
        dispatch(requestZen())

        return fetch('https://api.github.com/zen')
            .then(data => data.text())
            .then(text => dispatch(receiveZen(text)))
    }
}

export const actions = {
    requestZen,
    receiveZen,
    fetchZen,
    saveCurrentZen,
    createRuleEngine
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [REQUEST_ZEN]: (state) => {
        return ({
            ...state,
            fetching: true
        })
    },
    [RECEIVE_ZEN]: (state, action) => {
        return ({
            ...state,
            zens: state.zens.concat(action.payload),
            current: action.payload.id,
            fetching: false
        })
    },
    [SAVE_CURRENT_ZEN]: (state) => {
        return state.current != null ? ({
            ...state,
            saved: state.saved.concat(state.current)
        }) : state
    },
    [CREATE_RULE_ENGINE]: (state) => {
        return ({
            ...state
        })
    }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    fetching: false,
    current: null,
    zens: [],
    saved: []
}

export default function zenReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
