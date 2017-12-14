import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'users',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('./UsersContainer').default);
        }, 'users');
    }
})
