import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Star';
import HistoryIcon from '@material-ui/icons/History';
import Divider from '@material-ui/core/Divider';
import {
  HOME_MAIN_ID,
  FAVORITE_SPACES_WRAPPER_ID,
  RECENT_SPACES_WRAPPER_ID,
} from './config/selectors';
import { searchSpacesByQuery } from './utils/search';
import { getSpaces } from './actions';
import Styles from './Styles';
import SpaceGrid from './components/space/SpaceGrid';
import Loader from './components/common/Loader';
import Main from './components/common/Main';
import { HOME_PATH } from './config/paths';
import WelcomeContent from './components/common/WelcomeContent';

const styles = theme => ({
  ...Styles(theme),
  wrapper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    paddingLeft: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    margin: theme.spacing(1),
  },
});

class Home extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      settings: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      wrapper: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    spaces: PropTypes.instanceOf(List).isRequired,
    activity: PropTypes.bool,
    favoriteSpaces: PropTypes.instanceOf(List).isRequired,
    recentSpaces: PropTypes.instanceOf(List).isRequired,
    searchQuery: PropTypes.string.isRequired,
    dispatchGetSpaces: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activity: false,
  };

  state = {
    filteredRecentSpaces: List(),
    filteredFavoriteSpaces: List(),
  };

  componentDidMount() {
    const { dispatchGetSpaces } = this.props;
    dispatchGetSpaces();
  }

  componentDidUpdate({
    spaces: prevSpaces,
    searchQuery: prevSearchQuery,
    favoriteSpaces: prevFavoriteSpaces,
    recentSpaces: prevRecentSpaces,
  }) {
    const { spaces, searchQuery, favoriteSpaces, recentSpaces } = this.props;

    if (
      !spaces.equals(prevSpaces) ||
      searchQuery !== prevSearchQuery ||
      !favoriteSpaces.equals(prevFavoriteSpaces)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        filteredFavoriteSpaces: this.filterSpaces(favoriteSpaces),
      });
    }

    if (
      !spaces.equals(prevSpaces) ||
      searchQuery !== prevSearchQuery ||
      !recentSpaces.equals(prevRecentSpaces)
    ) {
      // reverse recent spaces to display most recent first
      const reversedRecentSpaces = recentSpaces.reverse();

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        filteredRecentSpaces: this.filterSpaces(reversedRecentSpaces),
      });
    }
  }

  filterSpaces = spaces => {
    const { searchQuery, spaces: originalSpaces } = this.props;
    // get space content by id
    let filteredSpaces = spaces
      .map(id => originalSpaces.find(({ id: spaceId }) => id === spaceId))
      // remove undefined space
      // this case can happen if originalSpaces is updated before spaces
      .filter(space => space);

    filteredSpaces = searchSpacesByQuery(filteredSpaces, searchQuery);
    return filteredSpaces;
  };

  renderFavoriteSpaces = () => {
    const { t, classes } = this.props;
    const { filteredFavoriteSpaces } = this.state;

    if (filteredFavoriteSpaces.isEmpty()) {
      return null;
    }

    return (
      <div id={FAVORITE_SPACES_WRAPPER_ID} className={classes.wrapper}>
        <Typography className={classes.title} variant="h6">
          <FavoriteIcon className={classes.icon} />
          {t('Favorite Spaces')}
        </Typography>
        <SpaceGrid spaces={filteredFavoriteSpaces} showActions saved />
      </div>
    );
  };

  renderRecentSpaces = () => {
    const { t, classes } = this.props;
    const { filteredRecentSpaces } = this.state;

    if (filteredRecentSpaces.isEmpty()) {
      return null;
    }

    return (
      <div id={RECENT_SPACES_WRAPPER_ID} className={classes.wrapper}>
        <Typography className={classes.title} variant="h6">
          <HistoryIcon className={classes.icon} />
          {t('Recent Spaces')}
        </Typography>
        <SpaceGrid spaces={filteredRecentSpaces} showActions saved />
      </div>
    );
  };

  render() {
    const { classes, activity, spaces } = this.props;
    const { filteredFavoriteSpaces, filteredRecentSpaces } = this.state;

    const noSpacesAvailable =
      filteredFavoriteSpaces.isEmpty() && filteredRecentSpaces.isEmpty();

    if (activity) {
      return (
        <div className={classNames(classes.root)} style={{ height: '100%' }}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar />
          </AppBar>
          <main className="Main">
            <Loader />
          </main>
        </div>
      );
    }

    return (
      <Main showSearch handleOnSearch={this.handleOnSearch} id={HOME_MAIN_ID}>
        {noSpacesAvailable ? (
          <WelcomeContent hasSavedSpaces={spaces.size > 0} />
        ) : (
          <div>
            {this.renderRecentSpaces()}
            <Divider />
            {this.renderFavoriteSpaces()}
          </div>
        )}
      </Main>
    );
  }
}

const mapStateToProps = ({ Space, authentication }) => ({
  spaces: Space.get('saved'),
  searchQuery: Space.getIn(['search', HOME_PATH]),
  activity: Boolean(Space.getIn(['current', 'activity']).size),
  favoriteSpaces: authentication.getIn(['user', 'favoriteSpaces']),
  recentSpaces: authentication.getIn(['user', 'recentSpaces']),
});

const mapDispatchToProps = {
  dispatchGetSpaces: getSpaces,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Home);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
