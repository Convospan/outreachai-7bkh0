'use server';
import { combineReducers } from 'redux';
import callReducer from './callReducer';
import complianceReducer from './complianceReducer';

const rootReducer = combineReducers({
  call: callReducer,
  compliance: complianceReducer,
});

export default rootReducer;
