import AuthReducer from './AuthReducer';
import WorkoutReducer from './WorkoutReducer';
import ConnectivityReducer from './ConnectivityReducer';
import WeightReducer from './WeightReducer';

export default ({
    auth: AuthReducer,
    workouts: WorkoutReducer,
    connection: ConnectivityReducer,
    bodyStats: WeightReducer
});
