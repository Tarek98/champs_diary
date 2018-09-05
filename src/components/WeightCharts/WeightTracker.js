import React, { Component } from 'react';
import { ScrollView, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import { LineChart } from 'react-native-chart-kit';
import Moment from 'moment';
import { Card, CardSection, Input, Button, Spinner } from '../common';
import { submitBodyStats, populateStatsChart, populateStatsInput } from '../../actions';

class WeightTracker extends Component {
    constructor() {
        super();
        this.state = { 
            date: Moment().toDate(),
            chartStartDate: Moment().subtract(1, 'month').toDate(),
            minDate: Moment().subtract(2, 'years').toDate(),
            maxDate: Moment().add(1, 'month').toDate(),
            units: { mass: 'lbs', length: 'cm' },
            weight: '',
            waist: '',
            error: '',
            chartYAxis: 'Weight',
            weightChart: { labels: ['O'], datasets: [{ data: [0] }] },
            waistChart: { labels: ['O'], datasets: [{ data: [0] }] }
        };

        this.chartConfig = {
            backgroundGradientFrom: 'rgb(46, 53, 97)',
            backgroundGradientTo: 'rgb(46, 53, 97)',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        };

        this.chartCategories = [{ value: 'Weight' }, { value: 'Waist' }];
    }

    componentWillMount() {
        this.props.populateStatsChart(this.props.user.uid, 
            Moment(this.state.chartStartDate).format('YYYYMMDD'));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chartDataSets) {
            this.setState({
                weightChart: nextProps.chartDataSets.weightArray,
                waistChart: nextProps.chartDataSets.waistArray
            });
        } 
        if (nextProps.weight) {
            let { weight, waist } = '';
            if (nextProps.weight !== 'unknown') {
                weight = String(nextProps.weight);
                waist = String(nextProps.waist);
            }
            this.setState({
                weight,
                waist
            });
        }
    }

    renderMessage() {
        const msgCondition = this.state.error || this.props.successMsg || this.props.errorMsg;
        if (msgCondition) {
            const msgColor = (this.props.errorMsg || this.state.error) ? 'red' : 'green';
            return (
                <CardSection style={{ justifyContent: 'center' }}>
                    <Text style={{ color: msgColor }}>
                        {msgCondition}
                    </Text>
                </CardSection>
            );
        } 
    }

    renderStatsChart(height, width) {
        const selectedChart = () => {
            switch (this.state.chartYAxis) {
                case 'Weight':
                    return this.state.weightChart;
                case 'Waist':
                    return this.state.waistChart;
                default:
                    return { labels: ['O'], datasets: [{ data: [0] }] };
            }
        };

        if (this.props.chartLoading) { 
            return (
                <Spinner size='large' />
            );
        } 
        return (
            <LineChart
                data={selectedChart()}
                width={width - 10}
                height={(height / 2) - 75}
                chartConfig={this.chartConfig}
            />
        ); 
    }

    render() {
        // Get screen width and height
        const { height, width } = Dimensions.get('window');

        return (
        <ScrollView> 
            <Card>
                <CardSection style={{ justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Update or view your weight by changing the date!
                    </Text>
                </CardSection>
                <CardSection>
                    <DatePicker
                        date={this.state.date}
                        onDateChange={(date) => {
                            this.setState({ date });
                            this.props.populateStatsInput(this.props.user.uid, 
                                Moment(date).format('YYYYMMDD'));
                        }}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        style={{ width: width - 30, paddingLeft: 20 }}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        value={this.state.weight}
                        label={'Weight'}
                        placeholder={'Required'}
                        inputType='numeric'
                        onChangeText={(val) => {
                            this.setState({ weight: parseFloat(parseFloat(val).toFixed(2)) });
                        }}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        value={this.state.waist}
                        label={'Waist Size'}
                        placeholder={'Optional'}
                        inputType='numeric'
                        onChangeText={(val) => {
                            this.setState({ waist: parseFloat(parseFloat(val).toFixed(2)) });
                        }}
                    />
                </CardSection>
                <CardSection>
                    <Button
                        onPress={() => {
                            if (this.state.weight === '' || isNaN(this.state.weight)) {
                                this.setState({ error: 'You must enter your weight!' });
                            } else if (this.state.weight <= 0 || 
                                (typeof this.state.waist === 'number' && this.state.waist <= 0)) {
                                this.setState({ error: 'The numbers must be greater than 0!' });
                            } else {
                                const dateCode = Moment(this.state.date).format('YYYYMMDD');
                                this.setState({ error: '' });
                                this.props.submitBodyStats(this.props.user.uid,
                                    dateCode,
                                    { 
                                        date: dateCode,
                                        weight: this.state.weight,
                                        waist: this.state.waist,
                                        units: this.state.units
                                    },
                                    Moment(this.state.chartStartDate).format('YYYYMMDD')
                                );
                            }
                        }}
                    >
                        Save Stats
                    </Button>
                </CardSection>
                {this.renderMessage()}
            </Card>
            <Card style={{ marginBottom: 10 }}>
                <CardSection style={{ justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Monthly Progress Chart
                    </Text>
                </CardSection>
                {this.renderStatsChart(height, width)}
                <CardSection>
                    <Dropdown
                        label='Chart Y-Axis'
                        data={this.chartCategories}
                        value={this.state.chartYAxis}
                        containerStyle={{ flex: 1, paddingLeft: 5, paddingRight: 10 }}
                        onChangeText={(val) => {
                            this.setState({ chartYAxis: val });
                        }}
                    />
                </CardSection>
                <CardSection style={{ flexDirection: 'column' }}>
                    <Text style={{ paddingLeft: 5 }}>
                        Month Start Date
                    </Text>
                    <Text />
                    <DatePicker
                        date={this.state.chartStartDate}
                        onDateChange={(chartStartDate) => {
                            this.setState({ chartStartDate });
                            this.props.populateStatsChart(this.props.user.uid, 
                                Moment(chartStartDate).format('YYYYMMDD'));
                        }}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        style={{ width: width - 15, paddingLeft: 5 }}
                    />
                </CardSection>
            </Card>
        </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    const { user } = state.auth;
    const { successMsg, errorMsg, loading, chartLoading, chartDataSets,
         weight, waist } = state.bodyStats;

    return { user, loading, chartLoading, successMsg, errorMsg, chartDataSets, weight, waist };
};

export default connect(mapStateToProps, { submitBodyStats, 
                                            populateStatsChart, 
                                            populateStatsInput })(WeightTracker);
