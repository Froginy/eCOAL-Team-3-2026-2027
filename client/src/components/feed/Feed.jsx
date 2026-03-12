import logo from '../../assets/logo.svg'
import PostCard from '../postCards/postCards.jsx'
import sort from '../../assets/sort.svg'

function Feed()   {

    return(
        <div className="flex flex-col w-full items-center m-auto p-0">
            <div className="w-11/12 m-6 flex flex-row justify-between">
                <img src={logo} alt="Logo" className="h-5" />
                <a href=""><img src={sort} alt="Sort" className="h-5" /></a>
            </div>
            
            <PostCard />
            <PostCard />
            <PostCard />
        </div>
    )
}

export default Feed;