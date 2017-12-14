import { injectReducer } from '../../../store/reducers'

export default () => ({
    path: 'not-found',
    /*  Async getComponent is only invoked when route matches   */
    getComponent(nextState, cb) {
		/*  Webpack - use 'require.ensure' to create a split point
			and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
			/*  Webpack - use require callback to define
				dependencies for bundling   */

            // const reducer = require('./modules/zen').default

            /*  Add the reducer to the store on key 'zen'  */
            // injectReducer(store, { key: 'zen', reducer })

            /*  Return getComponent   */
            cb(null, require('./NotFoundContainer').default)

            /* Webpack named bundle   */
        }, 'not-found')
    }
})
