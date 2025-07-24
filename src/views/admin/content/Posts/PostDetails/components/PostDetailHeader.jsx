// views/PostDetails/components/PostDetailHeader.jsx
// import React from 'react';

const PostDetailHeader = ({ title }) => {
    return <h3>{title || 'Post Details'}</h3>;
};

export default PostDetailHeader;