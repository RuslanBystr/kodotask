import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import { IAuthState } from '.';

export const authStateSelector = (state: RootState) => state.auth;

export const selectAuthenticatedUserSelector = createSelector(authStateSelector, (state: IAuthState) => state.admin);
