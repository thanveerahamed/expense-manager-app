import CategoryIcon from '@mui/icons-material/Category';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';
import LockResetIcon from '@mui/icons-material/LockReset';
import PaidIcon from '@mui/icons-material/Paid';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SettingsIcon from '@mui/icons-material/Settings';

import {AppRoute, NavGroup} from '../../common/types';
import BudgetMoreDetails from '../Budgets/BudgetMoreDetails';
import Budgets from '../Budgets/Budgets';
import CategoryTabView from '../Categories/CategoryTabView';
import Setup from '../Connections/Setup';
import BankSelector from '../Connections/steps/BankSelector';
import ConnectionResult from '../Connections/steps/ConnectionResult';
import Dashboard from '../Dashboard/Dashboard';
import Insights from '../Insights/Insights';
import SyncTransactionJobs from '../Jobs/SyncTransactionJobs';
import LabelTransactions from '../Labels/LabelTransactions';
import Labels from '../Labels/Labels';
import ResetRequisition from '../Settings/ResetRequisition';
import Settings from '../Settings/Settings';
import Transactions from '../Transactions/Transactions';
import TransactionView from '../common/transactions/TransactionView';

export const applicationRoutes: AppRoute[] = [
    {
        id: 'dashboard',
        description: '',
        name: 'Home',
        path: '/',
        menuIcon: HomeIcon,
        component: Dashboard,
        parent: NavGroup.DailyExpense,
        showInBottomNav: true,
        showInSideMenu: false,
    },
    {
        id: 'transactions',
        description: '',
        name: 'Transactions',
        path: '/transactions',
        menuIcon: PaidIcon,
        component: Transactions,
        parent: NavGroup.DailyExpense,
        showInBottomNav: true,
        showInSideMenu: false,
    },
    {
        id: 'labels',
        description: '',
        name: 'Labels',
        path: '/labels',
        menuIcon: PaidIcon,
        component: Labels,
        parent: NavGroup.DailyExpense,
        showInBottomNav: false,
        showInSideMenu: false,
    },
    {
        id: 'label-transaction',
        description: '',
        name: 'Labels',
        path: '/labels/:labelId/transactions',
        menuIcon: PaidIcon,
        component: LabelTransactions,
        parent: NavGroup.DailyExpense,
        showInBottomNav: false,
        showInSideMenu: false,
    },
    {
        id: 'transaction-view',
        description: '',
        name: 'Transaction',
        path: '/transactions/:transactionId',
        menuIcon: PaidIcon,
        component: TransactionView,
        parent: NavGroup.DailyExpense,
        showInBottomNav: false,
        showInSideMenu: false,
    },
    {
        id: 'insight-view',
        description: '',
        name: 'Insights',
        path: '/insights',
        menuIcon: InsightsIcon,
        component: Insights,
        parent: NavGroup.DailyExpense,
        showInBottomNav: true,
        showInSideMenu: false,
    },
    {
        id: 'budgets',
        description: '',
        name: 'Budgets',
        path: '/budgets',
        menuIcon: PriceCheckIcon,
        component: Budgets,
        parent: NavGroup.DailyExpense,
        showInBottomNav: true,
        showInSideMenu: false,
    },
    {
        id: 'budget-view',
        description: '',
        name: 'Budget',
        path: '/budgets/:budgetId',
        menuIcon: PriceCheckIcon,
        component: BudgetMoreDetails,
        parent: NavGroup.DailyExpense,
        showInBottomNav: false,
    },
    {
        id: 'connection-setup',
        description: '',
        name: 'Setup',
        path: '/connection-setup',
        menuIcon: PriceCheckIcon,
        component: Setup,
        parent: NavGroup.DailyExpense,
        showInBottomNav: false,
        showInSideMenu: false,
        childRoutes: [
            {
                id: 'connection-setup-landing',
                description: '',
                name: 'Setup',
                path: 'bank-selector',
                menuIcon: PriceCheckIcon,
                component: BankSelector,
                parent: NavGroup.DailyExpense,
                showInBottomNav: false,
                showInSideMenu: false,
            },
            {
                id: 'connection-setup-result',
                description: '',
                name: 'Setup',
                path: 'result',
                menuIcon: PriceCheckIcon,
                component: ConnectionResult,
                parent: NavGroup.DailyExpense,
                showInBottomNav: false,
                showInSideMenu: false,
            },
        ],
    },
    {
        id: 'categories',
        description: '',
        name: 'Categories',
        path: '/categories',
        menuIcon: CategoryIcon,
        component: CategoryTabView,
        parent: NavGroup.DailyExpense,
        showInSideMenu: false,
    },
    {
        id: 'syncTransactionJobs',
        description: '',
        name: 'Transaction Jobs',
        path: '/sync-transaction-jobs',
        menuIcon: CloudSyncIcon,
        component: SyncTransactionJobs,
        parent: NavGroup.Settings,
        showInSideMenu: true,
    },
    {
        id: 'settings',
        description: '',
        name: 'Settings',
        path: '/settings',
        menuIcon: SettingsIcon,
        component: Settings,
        parent: NavGroup.Settings,
        showInSideMenu: true,
    },
    {
        id: 'resetRequisition',
        description: '',
        name: 'Reset requisition',
        path: '/reset-requisition',
        menuIcon: LockResetIcon,
        component: ResetRequisition,
        parent: NavGroup.Settings,
        showInSideMenu: true,
    },
];
