import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'dashboard',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('./DashboardContainer').default);
        }, 'dashboard');
    }
})
