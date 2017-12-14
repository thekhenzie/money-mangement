// We only need to import the modules necessary for initial render
import DefaultLayout from '../layouts/DefaultLayout';
import Home from './Home';
import { injectReducer } from '../store/reducers';
import ROUTES from './routes';

import SimulatorRoute from './Navigation/Simulator';
import StatementsRoute from './Navigation/Statements';
import AnalyticsRoute from './Navigation/Analytics';
import FinancialsRoute from './Navigation/Financials';
import DashboardRoute from './Navigation/Dashboard';
import RulesEngineRoute from './Navigation/RulesEngine';
import UsersRoute from './Navigation/Users';
import AdminRoute from './Navigation/Admin';
import ZenRoute from './Navigation/Zen';
import LoginRoute from './Pages/Login';
import RegisterRoute from './Pages/Register';
import ForgotPasswordRoute from './Pages/ForgotPassword';
import NotFoundRoute from './Pages/NotFound';
/*  Note: Instead of using JSX, we recommend using react-router
		PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
	path: '/',
	component: DefaultLayout,
	indexRoute: Home,
	// childRoutes: ROUTES
	childRoutes: [
		ZenRoute(store),
		LoginRoute(),
		RegisterRoute(),
		ForgotPasswordRoute(),
		NotFoundRoute(),
		SimulatorRoute(),
		StatementsRoute(),
		FinancialsRoute(),
		DashboardRoute(),
		AnalyticsRoute(),
		RulesEngineRoute(store),
		AdminRoute(),
		UsersRoute()
	]

})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
		using getChildRoutes with the following signature:

		getChildRoutes (location, cb) {
			require.ensure([], (require) => {
				cb(null, [
					// Remove imports!
					require('./Counter').default(store)
				])
			})
		}

		However, this is not necessary for code-splitting! It simply provides
		an API for async route definitions. Your code splitting should occur
		inside the route `getComponent` function, since it is only invoked
		when the route exists and matches.
*/

export default createRoutes
