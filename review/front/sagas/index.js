import { all, fork } from '@redux-saga/core/effects';

import postSaga from './post';
import userSaga from './user';

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
