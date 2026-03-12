import PostBar from '../PostBar/PostBar.jsx'
import arrow from '../../assets/arrow.svg'
import dots from '../../assets/dots.svg'
import dice1 from '../../assets/dice1.svg'
import dice2 from '../../assets/dice2.svg'
import dice3 from '../../assets/dice3.svg'
import { useState } from 'react'


function PostCard({ name, description, images, collection }) {
    const serverURL = 'http://127.0.0.1:8000/'; 
    const [CurrentImage, setCurrentImage] = useState(0);
    const diceIcons = [dice1, dice2, dice3];
    let imageCount = images ;

    const currentImageUrl = images && images.length > 0 ? images[CurrentImage].image_url : '';

    const nextImage = (e) => {
        e.preventDefault(); // Stop page refresh
        if (images && images.length > 0) {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }
    };


    return (
        <div className='relative w-75 md:w-100 mb-7.5 bg-white shadow-lg rounded-2xl flex flex-col '>
            
            
            <PostBar user_id={collection?.user_id} title={collection?.title} />

            
            <img 
                src={`${serverURL}${currentImageUrl}`} 
                alt={`${name} - ${CurrentImage}`} 
                className='aspect-square object-cover w-[110%] self-center rounded-3xl shadow-lg' 
            />


            <button 
                    onClick={nextImage}
                    className="absolute top-35 md:top-45 md:-right-5 aspect-square w-5 md:w-10 -right-3.5 flex justify-center items-center bg-white rounded-full p-1.25 md:p-2">
                <img src={arrow} alt="arrow" className="rotate-270 h-1.5" />
            </button>

            <div className='flex justify-center absolute top-66.25 md:top-90 gap-1.25 ml-1.25'>
    {images.map((_, index) => (
      <img 
        key={index}
        src={diceIcons[index % diceIcons.length]}
        alt={`dice-${index}`}
        className={`w-5 odd:rotate-15 even:rotate--15 transition-opacity ${CurrentImage === index ? 'opacity-100' : 'opacity-40'}`} 
      />
    ))}
  </div>
            
            <a href="" className="absolute aspect-square w-5 right-5 top-66.25 md:top-90 flex justify-center items-center"> 
                <img src={dots} alt="dots" className="h-6.5" />
            </a>

            
            <div className='flex flex-col'>

                <p className="text-left leading-5 w-75 p-4">{description}</p>
            </div>
        </div>
    );
}

export default PostCard;