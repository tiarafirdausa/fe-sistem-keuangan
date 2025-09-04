import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import { AiFillEye } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format'
import appConfig from '@/configs/app.config'

const TopPost = ({ data }) => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Top Posts</h4>
            </div>
            <div className="mt-5">
                {data.map((post, index) => (
                    <div
                        key={post.id}
                        className={classNames(
                            'flex items-center justify-between py-2',
                            !isLastChild(data, index) && 'border-b border-gray-200 dark:border-gray-600 mb-2',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Avatar
                                className="bg-white"
                                size={50}
                                src={`${appConfig.backendBaseUrl}${post.featured_image}`}
                                shape="round"
                            />
                            <div>
                                <div className="heading-text font-bold">
                                    {post.title}
                                </div>
                                <div className="flex items-center gap-1">
                                    <AiFillEye className="text-sm" />
                                    Views: <NumericFormat value={post.hits} displayType="text" thousandSeparator={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default TopPost