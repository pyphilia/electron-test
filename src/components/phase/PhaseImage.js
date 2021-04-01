import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './PhaseImage.css';

const PhaseImage = ({ url, asset, name, folder }) => {
  let uri = url;
  if (asset) {
    // assets with absolute paths are usually for testing
    if (asset.startsWith('/')) {
      uri = `file://${asset}`;
    } else {
      uri = `file://${folder}/${asset}`;
    }
  }

  return (
    <div className="ImageDiv">
      <img src={uri} alt={name} className="Image" />
    </div>
  );
};

PhaseImage.propTypes = {
  url: PropTypes.string,
  asset: PropTypes.string,
  name: PropTypes.string,
  folder: PropTypes.string.isRequired,
};

PhaseImage.defaultProps = {
  url: null,
  asset: null,
  name: 'Image',
};

const mapStateToProps = ({ authentication }) => ({
  folder: authentication.getIn(['current', 'folder']),
});

const ConnectedComponent = connect(mapStateToProps)(PhaseImage);

export default ConnectedComponent;
