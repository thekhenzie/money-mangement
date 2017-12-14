import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'statements',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('./StatementsContainer').default);
        }, 'statements');
    }
})
