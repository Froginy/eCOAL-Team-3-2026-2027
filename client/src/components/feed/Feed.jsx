import logo from '../../assets/logo.svg'
import './feed.css'
import PostCard from '../postCards/postCards.jsx'
import sort from '../../assets/sort.svg'
function Feed()   {

    return(
        <div className="feed">
            <div className="feed-header">
            <img src={logo} alt="Logo" />
            <a href=""><img src={sort} alt="Sort" /></a>
            </div>
            <PostCard />
            <PostCard />
            <PostCard />
        </div>
    )
}

export default Feed;