import React, {useState, useEffect} from "react";
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async() =>{
    const res = await axios.get('http://localhost:5002/posts');
    setPosts(res.data);
  };

  useEffect(()=>{
    fetchPosts();
  }, []);

  const renderPosts = Object.values(posts).map(post =>{
    return(
      <div
      className = 'card'
      style = {{ width: '30%', marginBottom:'20px'}}
      key = {post.id}
      >
        <div className="card-body">
          <h5>{post.title}</h5>
          <CommentList comments = {post.comments} />
          <CommentCreate postId={post.id} />
        </div>

      </div>
    )

  })

  return (
   <div className="d-flex flex-row flex-wrap justify-content-between">{renderPosts}</div>
  );
};

export default PostList;
