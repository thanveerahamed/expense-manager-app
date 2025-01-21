import {ComponentType, FunctionComponent} from 'react';

import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

export enum NavGroup {
    DailyExpense = 'Daily Expense',
    Settings = 'Settings',
}

export interface AppRoute {
    id: string;
    name: string;
    description?: string;
    path: string;
    menuIcon: ComponentType<SvgIconProps>;
    component: FunctionComponent;
    parent?: NavGroup;
    showInBottomNav?: boolean;
    showInSideMenu?: boolean;
    childRoutes?: AppRoute[];
}
