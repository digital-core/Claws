import {render} from 'inferno'
import {Provider} from 'inferno-redux'
import {createStore} from 'redux'
import {BrowserRouter, Route, Switch, Link} from 'inferno-router'

import rootReducer from './reducers'

import Home from './components/home'
import Search from './components/search'

const store = createStore(rootReducer)

const About = () => (
    <div>
        <h2>About</h2>
    </div>
)

const Topic = ({match}) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
)

const Topics = ({match}) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>Rendering with React</Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>Components</Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
            </li>
        </ul>

        <Route path={`${match.url}/:topicId`} component={Topic}/>
        <Route
            exact
            path={match.url}
            render={() => <h3>Please select a topic.</h3>}
       />
    </div>
)

const Router = () => (
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/search">Search</Link></li>
                    <li><Link to="/player">Player</Link></li>
                    <li><Link to="/manualplay">Manual Play</Link></li>
                </ul>
                <hr/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/player" component={Topics}/>
                    <Route path="/manualplay" component={About}/>
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
)

// Render HTML on the browser
render(<Router/>, document.getElementById('main'))

