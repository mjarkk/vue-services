import {moduleFactory} from '../../serv-vue';
import OverviewPage from '../pages/users/Overview.vue';
import ShowPage from '../pages/users/Show.vue';

export const usersModule = moduleFactory(
    'users',
    {overview: OverviewPage, show: ShowPage},
    {singular: 'user', plural: 'users'}
);
