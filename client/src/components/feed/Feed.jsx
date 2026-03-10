import logo from '../../assets/logo.svg'
import './feed.css'
import PostCard from '../postCards/postCards.jsx'

function Feed()   {

    return(
        <div className="feed">
            <img src={logo} alt="Logo" />
            <PostCard />
            <PostCard />
            <PostCard />
        </div>
    )
}

export default Feed;