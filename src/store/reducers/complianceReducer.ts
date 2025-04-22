
const initialState = { consent: false };

type Action = { type: 'SET_CONSENT'; payload: boolean };

export default async function complianceReducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'SET_CONSENT':
      return { ...state, consent: action.payload };
    default:
      return state;
  }
}
