import MySidebar from '../Layout/Sidebar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RevenueChart from '@/components/dashboard/RevenueChart'; // Assuming this is a separate component for general revenue
import WebsiteVisitors from '@/components/dashboard/WebsiteVisitors';
import { Breadcrumbs } from '../components/breadcrumbs';
// import SectorSalesChart from '@/components/dashboard/RevenueChart'; // Import the dedicated SectorSalesChart


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { usePage, Head } from '@inertiajs/react';

import {
    faChartBar,
    faDollarSign,
    faChartLine,
    faWallet,
    faCheckCircle,
    faFileAlt,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

interface SegmentasiPasarChartData {
    sector: string;
    totalSales: number;
}

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChartBar } from '@fortawesome/free-solid-svg-icons';

<DashboardCard
    icon={<FontAwesomeIcon icon={faChartBar} />}
    title="Total Contacts"
    value="123"
/>

const Dashboard: React.FC = () => {
    const [totalContacts, setTotalContacts] = useState(0);
    const [totalSectors, setTotalSectors] = useState(0);
    const [totalLeads, setTotalLeads] = useState(0);
    const [segmentasiChartData, setSegmentasiChartData] = useState<SegmentasiPasarChartData[]>([]);

    // Unused state variables from original code, kept commented out fetch calls.
    const [totalSegmentasi, setTotalSegmentasi] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [grand_total_this_month, setgrand_total_this_month] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { props } = usePage();
    const user = props.auth?.user;

    // console.log("All Inertia props:", props); // For debugging, consider removing in production

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Contacts Count
                const contactsResponse = await fetch('/contactscount');
                if (!contactsResponse.ok) throw new Error(`HTTP error! status: ${contactsResponse.status} for contacts`);
                const contactsData = await contactsResponse.json();
                setTotalContacts(contactsData.totalContacts);

                // Fetch Sectors Count
                const sectorsResponse = await fetch('/sectorscount');
                if (!sectorsResponse.ok) throw new Error(`HTTP error! status: ${sectorsResponse.status} for sectors`);
                const sectorsData = await sectorsResponse.json();
                setTotalSectors(sectorsData.totalSectors);

                // Fetch Leads Count
                const leadsResponse = await fetch('/leadscount');
                if (!leadsResponse.ok) throw new Error(`HTTP error! status: ${leadsResponse.status} for leads`);
                const leadsData = await leadsResponse.json();
                setTotalLeads(leadsData.totalLeads);

                const productResponse = await fetch('/productcount');
                if (!productResponse.ok) throw new Error(`HTTP error! status: ${leadsResponse.status} for leads`);
                const productData = await productResponse.json();
                setTotalProduct(productData.totalProduct);

                const salesResponse = await fetch('/reports/grand-total-this-month');
                if (!salesResponse.ok) throw new Error(`HTTP error! status: ${leadsResponse.status} for leads`);
                const salesData = await salesResponse.json();
                setgrand_total_this_month(salesData.grand_total_this_month);

                // Fetch Segmentasi Data for Chart
                const segmentasiResponse = await fetch('/segment');
                if (!segmentasiResponse.ok) throw new Error(`HTTP error! status: ${segmentasiResponse.status} for segmentasi`);
                const segmentasiJson = await segmentasiResponse.json();

                const chartData = segmentasiJson.data
                    .filter((item: any) => !isNaN(parseFloat(item.total_penjualan)))
                    .map((item: any) => ({
                        sector: item.sector_name || 'Unknown Sector',
                        totalSales: parseFloat(item.total_penjualan),
                    }))
                    .filter((item: SegmentasiPasarChartData) => item.totalSales >= 0); // Ensure non-negative sales

                setSegmentasiChartData(chartData);

                // // Uncomment and implement these if needed in your dashboard
                // const segmentasiCountResponse = await fetch('/segmentasicount');
                // if (!segmentasiCountResponse.ok) throw new Error(`HTTP error! status: ${segmentasiCountResponse.status} for segmentasi count`);
                // const segmentasiCountData = await segmentasiCountResponse.json();
                // setTotalSegmentasi(segmentasiCountData.totalSegmentasi);

                // const transactionsResponse = await fetch('/transactioncount');
                // if (!transactionsResponse.ok) throw new Error(`HTTP error! status: ${transactionsResponse.status} for transactions`);
                // const transactionsData = await transactionsResponse.json();
                // setTotalTransactions(transactionsData.totalTransactions);

                // const reportsResponse = await fetch('/reportcount');
                // if (!reportsResponse.ok) throw new Error(`HTTP error! status: ${reportsResponse.status} for reports`);
                // const reportsData = await reportsResponse.json();
                // setTotalReports(reportsData.totalReports);

                // const productsResponse = await fetch('/productcount');
                // if (!productsResponse.ok) throw new Error(`HTTP error! status: ${productsResponse.status} for products`);
                // const productsData = await productsResponse.json();
                // setTotalProducts(productsData.totalProducts);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="flex min-h-screen items-center justify-center text-red-600 text-lg">Error: {error}</div>;
    }

    return (
        <>
            <Head title="Dashboard - Tappp" />
            <div className="flex min-h-screen">
                <MySidebar />

                <main className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Dashboard Overview</h1>
                    <Breadcrumbs
                        breadcrumbs={[
                            { title: 'Dashboard', href: '/dashboard' },
                        ]}
                    />
                </div>

                {/* Card Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto mb-10">
                    <DashboardCard
                        icon={<FontAwesomeIcon icon={faChartBar} />}
                        title="Total Contacts"
                        value={loading ? '...' : totalContacts.toLocaleString('id-ID')}
                    />
                    <DashboardCard
                        icon={<FontAwesomeIcon icon={faDollarSign} />}
                        title="Total Sectors"
                        value={loading ? '...' : totalSectors.toLocaleString('id-ID')}
                    />
                    <DashboardCard
                        icon={<FontAwesomeIcon icon={faChartLine} />}
                        title="Total Leads"
                        value={loading ? '...' : totalLeads.toLocaleString('id-ID')}
                    />
                    <DashboardCard
                        icon={<FontAwesomeIcon icon={faChartLine} />}
                        title="Total Product"
                        value={loading ? '...' : totalProduct.toLocaleString('id-ID')}
                    />
                    <DashboardCard
                        icon={<FontAwesomeIcon icon={faWallet} />}
                        title="Total Sales (Est.)"
                        // value={loading ? '...' : grand_total_this_month.toLocaleString('id-ID')}
                        value={`Rp. ${loading ? '...' : grand_total_this_month.toLocaleString('id-ID')}`}

                        // extra={
                        //     <div className="flex items-center space-x-2 cursor-pointer">
                        //         <img
                        //             src="https://storage.googleapis.com/a1aa/image/10a80627-1170-466c-30e4-b6e8345ab297.jpg"
                        //             alt="USA flag"
                        //             className="w-8 h-8 rounded-full object-cover"
                        //         />
                        //         <FontAwesomeIcon icon={faChevronDown} className="text-[#a3a8c0]" />
                        //     </div>
                        // }
                        iconBg="#3a8ee6"
                        iconColor="#fff"
                    />
                    <DashboardCard
                        icon={<FontAwesomeIcon icon={faCheckCircle} />}
                        title="New Leads"
                        value="1" // Static value
                        iconBg="#3a8ee6"
                        iconColor="#fff"
                    />
                    {/* <DashboardCard
                        icon={<FontAwesomeIcon icon={faFileAlt} />}
                        title="Total Projects"
                        value="2935" // Static value
                    /> */}
                </div>

                {/* General Charts Section */}
                <div className="flex flex-col md:flex-row gap-6 max-w-[1200px] mx-auto mb-6">

                    <RevenueChart data={segmentasiChartData} />
                    <WebsiteVisitors />
                </div>
            </main>
        </div>
    </>
    );
};

export default Dashboard;
