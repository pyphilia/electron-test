/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  mochaAsync,
  userSignIn,
  menuGoToSpacesNearby,
  menuGoToVisitSpace,
} from './utils';
import { createApplication, closeApplication } from './application';
import { DEFAULT_GLOBAL_TIMEOUT } from './constants';
import { USER_GRAASP } from './fixtures/users';

describe('Menu Scenarios', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  before(
    mochaAsync(async () => {
      console.log('test will run');
      app = await createApplication();
      console.log('app will signin');
      await userSignIn(app.client, USER_GRAASP);
    })
  );

  afterEach(function() {
    return closeApplication(app);
  });

  it(
    'MainMenu redirects to correct path',
    mochaAsync(async () => {
      const { client } = app;
      await menuGoToSpacesNearby(client);
      await menuGoToVisitSpace(client);
    })
  );
});
