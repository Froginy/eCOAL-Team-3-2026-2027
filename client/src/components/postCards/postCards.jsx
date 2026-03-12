import PostBar from '../PostBar/PostBar.jsx'
import arrow from '../../assets/arrow.svg'
import dots from '../../assets/dots.svg'
import dice1 from '../../assets/dice1.svg'
import dice2 from '../../assets/dice2.svg'
import dice3 from '../../assets/dice3.svg'
import { useState } from 'react'


function PostCard({ name, description, images, collection }) {

    const [CurrentImage, setCurrentImage] = useState(0);

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
                src={currentImageUrl} 
                alt={`${name} - ${CurrentImage}`} 
                className='aspect-square object-cover w-[110%] self-center rounded-3xl shadow-lg' 
            />

            {/* Flèche de navigation */}
            <button 
                    onClick={nextImage}
                    className="absolute top-35 md:top-45 md:-right-5 aspect-square w-5 md:w-10 -right-3.5 flex justify-center items-center bg-white rounded-full p-1.25 md:p-2">
                <img src={arrow} alt="arrow" className="rotate-270 h-1.5" />
            </button>

            

            {/* Petit indicateur de dés (Dices icons) */}
            <div className='flex justify-center absolute top-66.25 md:top-90 gap-1.25 ml-1.25'>
                <img src={dice1} alt="dice1" className="w-5 odd:rotate-15 even:rotate--15" />
                <img src={dice2} alt="dice2" className="w-5 odd:rotate-15 even:rotate--15" />
                <img src={dice3} alt="dice3" className="w-5 odd:rotate-15 even:rotate--15" />
            </div>

            {/* Menu options (Dots) */}
            <a href="" className="absolute aspect-square w-5 right-5 top-66.25 md:top-90 flex justify-center items-center"> 
                <img src={dots} alt="dots" className="h-6.5" />
            </a>

            {/* Contenu textuel */}
            <div className='flex flex-col'>
                <h3 className="px-4 pt-4 font-bold">{name}</h3>
<p className="text-sm text-gray-500 mb-2">Image {CurrentImage + 1} of {images?.length || 0}</p>
                <p className="text-left leading-5 text-gray-600">{description}</p>
            </div>
        </div>
    );
}

export default PostCard;