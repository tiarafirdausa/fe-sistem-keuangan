// src/views/admin/Dashboard/index.jsx
// import React from 'react';
// import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Loading from '@/components/shared/Loading';
import Card from '@/components/ui/Card';
import { HiOutlineUserGroup, HiOutlineDocumentText, HiOutlineChatAlt2 } from 'react-icons/hi';
import {
    apiGetDashboardSummary,
    apiGetAnalyticsData,
} from '@/services/DashboardService';

// --- Import Komponen Recharts ---
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';


const StatisticCard = ({ title, value, icon, className = '' }) => {
    return (
        <Card className={`flex items-center p-4 gap-4 ${className}`}>
            <div className="text-4xl text-blue-500">{icon}</div>
            <div>
                <h6 className="text-gray-500">{title}</h6>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </Card>
    );
};

const RecentList = ({ title, items, renderItem, emptyMessage }) => {
    return (
        <Card className="h-full">
            <h5 className="mb-4">{title}</h5>
            {items && items.length > 0 ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={item.id || index} className="py-2 border-b last:border-b-0">
                            {renderItem(item)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">{emptyMessage}</p>
            )}
        </Card>
    );
};

// --- Komponen Dashboard Utama ---

const Dashboard = () => {
    // Mengambil data ringkasan
    const { data: summaryData, isLoading: isLoadingSummary } = useSWR(
        '/dashboard/summary',
        apiGetDashboardSummary
    );

    // Mengambil data analitik
    // Karena controller Anda mengembalikan data bulanan langsung, kita bisa menggunakannya.
    // Jika nanti ada filter periode, Anda bisa tambahkan state selectedPeriod seperti AnalyticDashboard
    const { data: analyticsData, isLoading: isLoadingAnalytics } = useSWR(
        '/dashboard/analytics', // Key SWR
        () => apiGetAnalyticsData({}) // Tidak ada params untuk sementara, sesuai controller Anda
    );

    return (
        <Loading loading={isLoadingSummary || isLoadingAnalytics}>
            {summaryData && ( // Pastikan summaryData ada sebelum merender
                <div className="flex flex-col gap-4">
                    <h3 className="mb-4">Dashboard Overview</h3>

                    {/* Statistik Ringkasan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatisticCard
                            title="Total Posts"
                            value={summaryData.totalPosts}
                            icon={<HiOutlineDocumentText />}
                        />
                        <StatisticCard
                            title="Total Pages"
                            value={summaryData.totalPages}
                            icon={<HiOutlineDocumentText />}
                        />
                        <StatisticCard
                            title="Total Users"
                            value={summaryData.totalUsers}
                            icon={<HiOutlineUserGroup />}
                        />
                        <StatisticCard
                            title="Total Comments"
                            value={summaryData.totalComments}
                            icon={<HiOutlineChatAlt2 />}
                        />
                    </div>

                    {/* Bagian Grafik Analitik */}
                    <Card>
                        <h5 className="mb-4">Monthly Visits Overview</h5>
                        {isLoadingAnalytics ? (
                            <div className="flex justify-center items-center h-48">
                                <Loading loading={true} />
                            </div>
                        ) : analyticsData && analyticsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={analyticsData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="visits"
                                        stroke="#8884d8" // Warna garis
                                        activeDot={{ r: 8 }}
                                        name="Visits" // Nama yang muncul di legend/tooltip
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500">No monthly visits data available.</p>
                        )}
                    </Card>


                    {/* Daftar Terbaru */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <RecentList
                            title="Recent Posts"
                            items={summaryData.recentPosts}
                            emptyMessage="No recent posts."
                            renderItem={(post) => (
                                <>
                                    <p className="font-semibold">{post.title}</p>
                                    <span className="text-gray-400 text-sm">
                                        {new Date(post.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </>
                            )}
                        />
                        <RecentList
                            title="Recent Comments"
                            items={summaryData.recentComments}
                            emptyMessage="No recent comments."
                            renderItem={(comment) => (
                                <>
                                    <p className="font-semibold">{comment.author_name} on <span className="text-blue-500">{comment.postTitle}</span></p>
                                    <p className="text-sm text-gray-700 truncate">{comment.content}</p>
                                    <span className="text-gray-400 text-sm">
                                        {new Date(comment.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </>
                            )}
                        />
                        <RecentList
                            title="Recent Users"
                            items={summaryData.recentUsers}
                            emptyMessage="No recent users."
                            renderItem={(user) => (
                                <>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-700">{user.email}</p>
                                    <span className="text-gray-400 text-sm">
                                        Joined: {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </>
                            )}
                        />
                    </div>
                </div>
            )}
        </Loading>
    );
};

export default Dashboard;