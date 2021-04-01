import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getDeveloperMode, setDeveloperMode } from '../../actions';
import Loader from './Loader';
import { DEVELOPER_SWITCH_ID } from '../../config/selectors';
import { FORM_CONTROL_MIN_WIDTH } from '../../config/constants';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
});

export class DeveloperSwitch extends Component {
  static propTypes = {
    developerMode: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetDeveloperMode: PropTypes.func.isRequired,
    dispatchSetDeveloperMode: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const { dispatchGetDeveloperMode } = this.props;
    dispatchGetDeveloperMode();
  }

  handleChange = async ({ target }) => {
    const { dispatchSetDeveloperMode } = this.props;
    const { checked } = target;
    dispatchSetDeveloperMode(checked);
  };

  render() {
    const { classes, t, developerMode, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    const control = (
      <Switch
        checked={developerMode}
        onChange={this.handleChange}
        value={developerMode}
        color="primary"
      />
    );

    return (
      <FormControl id={DEVELOPER_SWITCH_ID} className={classes.formControl}>
        <FormControlLabel control={control} label={t('Developer Mode')} />
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  developerMode: authentication.getIn(['user', 'settings', 'developerMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetDeveloperMode: getDeveloperMode,
  dispatchSetDeveloperMode: setDeveloperMode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeveloperSwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
