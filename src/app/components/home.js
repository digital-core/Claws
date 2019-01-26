import {Component} from 'inferno'
import {Link} from 'inferno-router'

class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Link to="/search" className="mdl-button theme--dark mdl-js-button mdl-button--raised mdl-js-ripple-effect">Search TV shows and movies... <i class="material-icons">search</i></Link>
            </div>
        )
    }
}

export default Home