import Loading from '@/components/shared/Loading'
import Overview from './components/Overview'
import RecentComments from './components/RecentComment'
import TopPost from './components/TopPost'
import { apiGetDashboardSummary, apiGetAnalyticsData } from '@/services/DashboardService'
import useSWR from 'swr'
import RecentPosts from './components/RecentPosts'

const Dashboard = () => {
    const { data: summaryData, isLoading: isSummaryLoading } = useSWR(
        ['/api/dashboard/summary'],
        () => apiGetDashboardSummary(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const { data: analyticsData, isLoading: isAnalyticsLoading } = useSWR(
        ['/api/dashboard/analytics'],
        () => apiGetAnalyticsData(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const isLoading = isSummaryLoading || isAnalyticsLoading;

    return (
        <Loading loading={isLoading}>
            {summaryData && analyticsData && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                    <div className="xl:col-span-8">
                        <div className="flex flex-col gap-4">
                            <Overview data={summaryData} analyticsData={analyticsData} />
                            <RecentPosts data={summaryData.recentPosts} /> 
                        </div>
                    </div>
                    <div className="xl:col-span-4">
                        <div className="flex flex-col gap-4">
                            <TopPost data={summaryData.topPosts} />
                            <RecentComments data={summaryData.recentComments} />
                        </div>
                    </div>
                </div>
            )}
        </Loading>
    )
}

export default Dashboard