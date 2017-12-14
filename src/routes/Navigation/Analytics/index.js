import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'analytics',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('./AnalyticsContainer').default);
        }, 'analytics');
    }
})
