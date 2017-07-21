import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class BarContainer extends React.Component {
  static propTypes = {}

  render() {
    const { user } = this.props;
    if (user) {
      return (
        <ul className="nav nav-pills">
          <li className="dropdown">
            <a href="#user" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
              {user.name}
              <img className="gn-user-avatar" src={user.avatar_url} alt="avatar"/>
            </a>
            <ul className="dropdown-menu" role="menu">
              <li className="dropdown-header">@{user.login}</li>
              <li><a href={user.html_url}>Your Profile</a></li>
              <li><Link to="/logout">Logout</Link></li>
              <li className="divider"></li>
              <li className="dropdown-header">Gistnote</li>
              <li><a href="https://github.com/gistnote/gistnote.github.io">Send Feedback</a></li>
            </ul>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="nav nav-pills">
          <li>
            <Link to="/login">
              <span className="glyphicon glyphicon-user"></span> Sign in with GitHub
            </Link>
          </li>
        </ul>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BarContainer);
