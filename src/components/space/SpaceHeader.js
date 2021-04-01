import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar/AppBar';
import SaveIcon from '@material-ui/icons/Save';
import WarningIcon from '@material-ui/icons/Warning';
import WifiIcon from '@material-ui/icons/Wifi';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { saveSpace } from '../../actions/space';
import DeleteButton from './DeleteButton';
import ExportButton from './ExportButton';
import SyncButton from './SyncButton';
import ClearButton from './ClearButton';
import FavoriteButton from './FavoriteButton';
import {
  SPACE_TOOLBAR_ID,
  SPACE_SAVE_ICON_CLASS,
  SPACE_PREVIEW_ICON_CLASS,
  DRAWER_BUTTON_ID,
} from '../../config/selectors';
import { USER_MODES } from '../../config/constants';

class SpaceHeader extends Component {
  static propTypes = {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      saved: PropTypes.bool,
      offlineSupport: PropTypes.bool.isRequired,
    }).isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
    }).isRequired,
    openDrawer: PropTypes.bool.isRequired,
    handleDrawerOpen: PropTypes.func.isRequired,
    dispatchSaveSpace: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    userMode: PropTypes.oneOf(Object.values(USER_MODES)).isRequired,
  };

  handleSave = () => {
    const { space, dispatchSaveSpace } = this.props;
    dispatchSaveSpace({ space });
  };

  renderSaveButton() {
    const { space, classes, t } = this.props;
    const { saved, offlineSupport } = space;
    if (!saved) {
      if (offlineSupport) {
        return (
          <Tooltip title={t('Save this space for offline use.')}>
            <IconButton
              className={clsx(classes.button, SPACE_SAVE_ICON_CLASS)}
              color="inherit"
              onClick={this.handleSave}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        );
      }
      return (
        <Tooltip title={t('This space requires an internet connection.')}>
          <IconButton className={classes.button} color="inherit">
            <WifiIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  renderExportButton() {
    const { space } = this.props;
    const { saved } = space;
    if (saved) {
      return <ExportButton space={space} />;
    }
    return null;
  }

  renderDeleteButton() {
    const { space } = this.props;
    const { saved, id } = space;
    if (saved) {
      return <DeleteButton spaceId={id} />;
    }
    return null;
  }

  renderPreviewIcon() {
    const { space, classes, t } = this.props;
    const { saved } = space;
    if (!saved) {
      return (
        <Tooltip
          title={t(
            'You are previewing this space. Any input or changes will not be saved.'
          )}
        >
          <IconButton
            color="inherit"
            className={clsx(classes.button, SPACE_PREVIEW_ICON_CLASS)}
          >
            <WarningIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  renderSyncButton() {
    const { space } = this.props;
    const { saved, id } = space;
    if (saved) {
      return <SyncButton spaceId={id} />;
    }
    return null;
  }

  renderClearButton() {
    const { space } = this.props;
    const { saved, id } = space;
    if (saved) {
      return <ClearButton spaceId={id} />;
    }
    return null;
  }

  renderTeacherButtons() {
    const { userMode } = this.props;
    return userMode === USER_MODES.TEACHER ? (
      <>
        {this.renderDeleteButton()}
        {this.renderSyncButton()}
        {this.renderSaveButton()}
      </>
    ) : null;
  }

  renderFavoriteButton() {
    const { space } = this.props;
    const { saved, id } = space;
    if (saved) {
      return <FavoriteButton spaceId={id} />;
    }
    return null;
  }

  render() {
    const {
      openDrawer,
      classes,
      space: { name },
      handleDrawerOpen,
    } = this.props;
    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar id={SPACE_TOOLBAR_ID} disableGutters={!openDrawer}>
          <IconButton
            id={DRAWER_BUTTON_ID}
            color="inherit"
            aria-label="Open Drawer"
            onClick={handleDrawerOpen}
            className={classNames(
              classes.menuButton,
              openDrawer && classes.hide
            )}
          >
            <MenuIcon />
          </IconButton>
          {name}
          <span style={{ position: 'absolute', right: 20 }}>
            {this.renderClearButton()}
            {this.renderPreviewIcon()}
            {this.renderExportButton()}
            {this.renderTeacherButtons()}
            {this.renderFavoriteButton()}
          </span>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = ({ Space, authentication }) => ({
  space: Space.get('current')
    .get('content')
    .toJS(),
  userMode: authentication.getIn(['user', 'settings', 'userMode']),
});

const mapDispatchToProps = {
  dispatchSaveSpace: saveSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpaceHeader);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
