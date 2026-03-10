import './postCard.css'
import placeholder_dice from '../../assets/placeholder_dice.png'
import PostBar from '../PostBar/PostBar.jsx'

function PostCard()   {





    return(
    
        <div className='PostCard'>
        
        <PostBar />
        <img src={placeholder_dice} alt="dice_picture" className='DicePic'/>
        
        <p>Description</p>
        
        </div>)
}

export default PostCard;