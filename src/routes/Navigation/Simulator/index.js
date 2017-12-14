import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'simulator',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('./SimulatorContainer').default);
        }, 'statements');
    }
})
