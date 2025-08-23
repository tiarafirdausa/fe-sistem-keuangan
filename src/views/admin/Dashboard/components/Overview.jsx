import { useState, useEffect, useRef } from 'react'
import Card from '@/components/ui/Card'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import AbbreviateNumber from '@/components/shared/AbbreviateNumber'
import Chart from '@/components/shared/Chart'
import { useThemeStore } from '@/store/themeStore'
import classNames from '@/utils/classNames'
import { COLOR_1, COLOR_2, COLOR_4 } from '@/constants/chart.constant'
import { NumericFormat } from 'react-number-format'
import { TbPencil, TbUsers, TbEye } from 'react-icons/tb'
import dayjs from 'dayjs'

// Helper function to fill in missing daily data points
const fillMissingData = (data, dataKey) => {
    // If data is undefined or null, return an empty array to prevent the error.
    if (!data) {
        return [];
    }

    const filledData = [];
    const today = dayjs().startOf('day');
    for (let i = 29; i >= 0; i--) {
        const date = today.subtract(i, 'day').format('YYYY-MM-DD');
        const existingData = data.find(item => dayjs(item.period).isSame(date, 'day'));
        filledData.push({
            period: dayjs(date).format('MMM DD'),
            [dataKey]: existingData ? existingData[dataKey] : 0
        });
    }
    return filledData;
};

// Updated to reflect new data types
const chartColors = {
    totalPosts: COLOR_1,
    totalUsers: COLOR_2,
    pageViews: COLOR_4,
}

const StatisticCard = (props) => {
    const {
        title,
        value,
        label,
        icon,
        growShrink,
        iconClass,
        active,
        compareFrom,
        onClick,
    } = props

    return (
        <button
            className={classNames(
                'p-4 rounded-2xl cursor-pointer ltr:text-left rtl:text-right transition duration-150 outline-hidden',
                active && 'bg-white dark:bg-gray-900 shadow-md',
            )}
            onClick={() => onClick(label)}
        >
            <div className="flex md:flex-col-reverse gap-2 2xl:flex-row justify-between relative">
                <div>
                    <div className="mb-4 text-sm font-semibold">{title}</div>
                    <h3 className="mb-1">{value}</h3>
                    <div className="inline-flex items-center flex-wrap gap-1">
                        {growShrink !== undefined && (
                            <GrowShrinkValue
                                className="font-bold"
                                value={growShrink}
                                suffix="%"
                                positiveIcon="+"
                                negativeIcon=""
                            />
                        )}
                        <span>{compareFrom}</span>
                    </div>
                </div>
                <div
                    className={classNames(
                        'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
                        iconClass,
                    )}
                >
                    {icon}
                </div>
            </div>
        </button>
    )
}

const Overview = ({ data, analyticsData }) => {
    const [selectedCategory, setSelectedCategory] = useState('pageViews')

    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (!sideNavCollapse && isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (!isFirstRender.current) {
            window.dispatchEvent(new Event('resize'))
        }
    }, [sideNavCollapse])
    
    // Fill in missing daily data points
    // Use an empty array as a default if analyticsData is not yet loaded
    const dailyViewsData = analyticsData?.dailyViews || [];
    const dailyUsersData = analyticsData?.dailyUsers || [];

    const filledDailyPosts = fillMissingData(dailyViewsData, 'posts');
    const filledDailyUsers = fillMissingData(dailyUsersData, 'users');

    const chartDataMap = {
        totalPosts: {
            name: 'Total Posts',
            data: filledDailyPosts.map(item => item.posts),
        },
        totalUsers: {
            name: 'Total Users',
            data: filledDailyUsers.map(item => item.users),
        },
        pageViews: {
            name: 'Page Views',
            data: filledDailyPosts.map(item => item.posts),
        },
    };

    const chartDate = filledDailyPosts.map(item => item.period)
    const chartSeries = [{
        name: chartDataMap[selectedCategory].name,
        data: chartDataMap[selectedCategory].data,
    }];
    
    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Overview</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl p-3 bg-gray-100 dark:bg-gray-700 mt-4">
                <StatisticCard
                    title="Total Posts"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={data?.totalPosts || 0}
                            thousandSeparator={true}
                        />
                    }
                    iconClass="bg-sky-200"
                    icon={<TbPencil />}
                    label="totalPosts"
                    active={selectedCategory === 'totalPosts'}
                    onClick={setSelectedCategory}
                />
                <StatisticCard
                    title="Total Users"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={data?.totalUsers || 0}
                            thousandSeparator={true}
                        />
                    }
                    iconClass="bg-emerald-200"
                    icon={<TbUsers />}
                    label="totalUsers"
                    active={selectedCategory === 'totalUsers'}
                    onClick={setSelectedCategory}
                />
                <StatisticCard
                    title="Page Views"
                    value={
                        <AbbreviateNumber
                            value={analyticsData?.totalViews || 0}
                        />
                    }
                    iconClass="bg-purple-200"
                    icon={<TbEye />}
                    label="pageViews"
                    active={selectedCategory === 'pageViews'}
                    onClick={setSelectedCategory}
                />
            </div>
            <Chart
                type="line"
                series={chartSeries}
                xAxis={chartDate}
                height="410px"
                customOptions={{
                    legend: { show: false },
                    colors: [chartColors[selectedCategory]],
                }}
            />
        </Card>
    )
}

export default Overview