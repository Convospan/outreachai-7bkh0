'use server';
const initialState = { script: '', approved: false };

type Action = { type: 'APPROVE_SCRIPT'; payload: string };

export default function callReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'APPROVE_SCRIPT':
      return { ...state, approved: true, script: action.payload };
    default:
      return state;
  }
}
