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
    
        <div className='relative w-75 md:w-100 mb-7.5 bg-white shadow-lg rounded-2xl flex flex-col '>
        
        <PostBar />
        <img src={placeholder_dice} alt="dice_picture" className='aspect-square object-cover w-[110%] self-center rounded-3xl shadow-lg' />
            <a href="" className="absolute top-35 aspect-square w-5 -right-3.5 flex justify-center items-center bg-white rounded-full p-1.25"><img src={arrow} alt="arrow" className="rotate-270 h-1.5" /></a>
            <div className='flex justify-center absolute top-66.25 md:top-90 gap-1.25 ml-1.25'>
            <img src={dice1} alt="dice1" className="w-5 odd:rotate-15 even:rotate--15" />
            <img src={dice2} alt="dice2" className="w-5 odd:rotate-15 even:rotate--15" />
            <img src={dice3} alt="dice3" className="w-5 odd:rotate-15 even:rotate--15" />
            </div>

            <a href="" className="absolute aspect-square w-5 right-5 top-66.25 md:top-90 flex justify-center items-center"> 
                <img src={dots} alt="dots" className="h-6.5" />
            </a>
            <div className='flex flex-col '>
        <p className="text-left leading-5 w-75 p-4">{postContent}</p>
        </div>
        </div>)
}

export default PostCard;