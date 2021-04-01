import { Map, List } from 'immutable';
import {
  GET_SYNC_REMOTE_SPACE_SUCCEEDED,
  GET_SYNC_LOCAL_SPACE_SUCCEEDED,
  CLEAR_SYNC_SPACES,
  SELECT_SYNC_PHASE,
  CLEAR_SYNC_PHASES,
  FLAG_GETTING_SYNC_REMOTE_SPACE,
  FLAG_GETTING_SYNC_LOCAL_SPACE,
} from '../types';
import { updateActivityList } from './common';

const INITIAL_STATE = Map({
  activity: List(),
  remoteSpace: Map(),
  localSpace: Map(),
  current: Map({
    localPhase: Map(),
    remotePhase: Map(),
    diff: Map(),
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_GETTING_SYNC_REMOTE_SPACE:
    case FLAG_GETTING_SYNC_LOCAL_SPACE:
      return state.updateIn(['activity'], updateActivityList(payload));
    case CLEAR_SYNC_SPACES:
      return state.setIn(['remoteSpace'], Map()).setIn(['localSpace'], Map());
    case CLEAR_SYNC_PHASES:
      return state
        .setIn(['current', 'localPhase'], Map())
        .setIn(['current', 'remotePhase'], Map())
        .setIn(['current', 'diff'], Map());
    case GET_SYNC_REMOTE_SPACE_SUCCEEDED:
      return state.setIn(['remoteSpace'], Map(payload));
    case GET_SYNC_LOCAL_SPACE_SUCCEEDED:
      return state.setIn(['localSpace'], Map(payload));
    case SELECT_SYNC_PHASE:
      return state
        .setIn(['current', 'localPhase'], Map(payload.localPhase))
        .setIn(['current', 'remotePhase'], Map(payload.remotePhase))
        .setIn(['current', 'diff'], Map(payload.diff));
    default:
      return state;
  }
};
