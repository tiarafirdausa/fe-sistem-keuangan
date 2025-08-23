import { useCallback } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'

const { Tr, Td, TBody, THead, Th } = Table

// Define colors and labels for post statuses
const postStatusColor = {
    published: {
        label: 'Published',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    draft: {
        label: 'Draft',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    archived: { 
        label: 'Archived', 
        dotClass: 'bg-red-500', 
        textClass: 'text-red-500' 
    },
}

const PostTitle = ({ row }) => {
    const navigate = useNavigate()

    const handleView = useCallback(() => {
        // Updated: navigate to the edit page using the slug
        navigate(`/admin/posts/edit/${row.slug}`)
    }, [navigate, row])

    return (
        <span
            className="cursor-pointer select-none font-semibold hover:text-primary"
            onClick={handleView}
        >
            {row.title}
        </span>
    )
}

const columnHelper = createColumnHelper()

const columns = [
    columnHelper.accessor('title', {
        header: 'Post',
        cell: (props) => <PostTitle row={props.row.original} />,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (props) => {
            const { status } = props.row.original
            const statusInfo = postStatusColor[status] || {
                label: 'Unknown',
                dotClass: 'bg-gray-500',
                textClass: 'text-gray-500',
            }
            return (
                <div className="flex items-center">
                    <Badge className={statusInfo.dotClass} />
                    <span
                        className={`ml-2 rtl:mr-2 capitalize font-semibold ${statusInfo.textClass}`}
                    >
                        {statusInfo.label}
                    </span>
                </div>
            )
        },
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: (props) => {
            const row = props.row.original
            return <span>{dayjs(row.created_at).format('DD/MM/YYYY')}</span>
        },
    }),
    columnHelper.accessor('author_name', {
        header: 'Author',
    }),
    columnHelper.accessor('hits', {
        header: 'Views',
        cell: (props) => {
            const { hits } = props.row.original
            return (
                <NumericFormat
                    className="heading-text font-bold"
                    displayType="text"
                    value={hits}
                    thousandSeparator={true}
                />
            )
        },
    }),
]

const RecentPosts = ({ data = [] }) => {
    const navigate = useNavigate()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleViewAll = () => {
        // Updated: navigate to the list page
        navigate('/admin/posts')
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Recent Posts</h4>
                <Button size="sm" onClick={handleViewAll}>
                    View All
                </Button>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={columns.length}>
                                <div className="text-center py-4">No recent posts.</div>
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </Card>
    )
}

export default RecentPosts