import { injectReducer } from '../../../store/reducers'

export default (store) => ({
	path: 'rules-engine',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			const RulesEngine = require('./RulesEngineContainer').default
			const reducer = require('./rulesEngine').default
			injectReducer(store, { key: 'rules-engine', reducer })
			cb(null, RulesEngine)
		}, 'rules-engine')
	}
})
