
import './PostBar.css'
import add from '../../assets/add.svg'
import like from '../../assets/like.svg'
import placeholder from '../../assets/placeholder_pp.png'

function PostBar() {


    const username = "Username"; // This should be dynamically set based on the post's author
    return (
        <div className='PostBar'>
            <div className='left'>
                <a href="" className="fancy-link">
                    <img src={placeholder} alt="profile_picture" />
                    <p>{username}</p>
                </a>
            </div>
            <div className='right'>
                <a href=""><img src={add} alt="add" /></a>
                <a href=""><img src={like} alt="like" /></a>
            </div>
        </div>
    );

}

export default PostBar;
