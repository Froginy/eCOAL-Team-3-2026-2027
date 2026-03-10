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
    
        <div className='relative w-[300px] mb-7.5'>
        
        <PostBar />
        <img src={placeholder_dice} alt="dice_picture" className='aspect-square object-cover w-[300px] text-center rounded-3xl shadow-lg'/>
            <a href="" className="absolute top-[140px] aspect-square w-5 -right-3.5 flex justify-center items-center bg-white rounded-full p-1.25"><img src={arrow} alt="arrow" className="rotate-[-90deg] h-1.5" /></a>
            <div className='flex justify-center absolute top-[265px] gap-1.25 ml-1.25'>
            <img src={dice1} alt="dice1" className="w-5 odd:rotate-[15deg] even:rotate-[-15deg]" />
            <img src={dice2} alt="dice2" className="w-5 odd:rotate-[15deg] even:rotate-[-15deg]" />
            <img src={dice3} alt="dice3" className="w-5 odd:rotate-[15deg] even:rotate-[-15deg]" />
            </div>

            <a href="" className="absolute aspect-square w-5 right-5 top-[265px] flex justify-center items-center"> 
                <img src={dots} alt="dots" className="h-[26px]" />
            </a>
        <p className="text-left leading-5">{postContent}</p>
        
        </div>)
}

export default PostCard;