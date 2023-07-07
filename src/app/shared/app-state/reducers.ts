import { ActionReducerMap } from '@ngrx/store';
import * as fromAppState from './app-state.reducer';

export interface AppState {
  appState: fromAppState.State;
}
export const appReducer: ActionReducerMap<AppState, any> = {
  appState: fromAppState.appStateReducer,
};
