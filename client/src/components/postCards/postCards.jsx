import './postCard.css'
import placeholder_dice from '../../assets/placeholder_dice.png'
import PostBar from '../PostBar/PostBar.jsx'
import arrow from '../../assets/arrow.svg'
import dots from '../../assets/dots.svg'
import dice1 from '../../assets/dice1.svg'
import dice2 from '../../assets/dice2.svg'
import dice3 from '../../assets/dice3.svg'

function PostCard()   {


const postContent = "Cupidatat aute laborum aliqua consectetur voluptate laborum ipsum pariatur est deserunt enim eiusmod adipisicing duis. "

    return(
    
        <div className='PostCard'>
        
        <PostBar />
        <img src={placeholder_dice} alt="dice_picture" className='DicePic'/>
            <a href="" className="next"><img src={arrow} alt="arrow" /></a>
            <div className='dicesNumbers'>
            <img src={dice1} alt="dice1" />
            <img src={dice2} alt="dice2" />
            <img src={dice3} alt="dice3" />
            </div>

            <a href="" className="more"> 
                <img src={dots} alt="dots" />
            </a>
        <p>{postContent}</p>
        
        </div>)
}

export default PostCard;