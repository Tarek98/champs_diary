import AuthReducer from './AuthReducer';
import WorkoutReducer from './WorkoutReducer';
import ConnectivityReducer from './ConnectivityReducer';

export default ({
    auth: AuthReducer,
    workouts: WorkoutReducer,
    connection: ConnectivityReducer
});
