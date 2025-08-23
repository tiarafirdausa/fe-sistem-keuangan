import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const RecentComments = ({ data }) => {
    return (
        <Card>
            <h4>Recent Comments</h4>
            <div className="mt-4">
                {data.length > 0 ? (
                    data.map((comment, index) => (
                        <div
                            key={comment.id}
                            className={classNames(
                                'py-3', // Hapus 'flex' dari sini
                                !isLastChild(data, index) &&
                                    'border-b border-gray-200 dark:border-gray-600'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Avatar shape="circle">
                                    {comment.author_name ? comment.author_name[0] : 'U'}
                                </Avatar>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {comment.author_name || 'Anonymous'}
                                </span>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                                commented on &quot;<strong>{comment.postTitle}</strong>&quot;
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {comment.content.substring(0, 50)}...
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {dayjs(comment.created_at).fromNow()}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        No recent comments.
                    </p>
                )}
            </div>
        </Card>
    )
}

export default RecentComments