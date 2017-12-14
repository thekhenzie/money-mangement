import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'admin',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('./AdminContainer').default);
        }, 'admin');
    }
})
