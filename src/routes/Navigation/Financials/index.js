import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'financials',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('./FinancialsContainer').default);
        }, 'financials');
    }
})
