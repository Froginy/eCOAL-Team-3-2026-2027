
import add from '../../assets/add.svg'
import like from '../../assets/like.svg'
import placeholder from '../../assets/placeholder_pp.png'

function PostBar() {

    const username = "Username"; // This should be dynamically set based on the post's author
    return (
        <div className='flex flex-row justify-between items-center bg-white text-black w-56.25  md:w-75 h-10 mx-auto rounded-3xl absolute left-2.5 top-2.5'>
            <div className='flex items-center relative text-black m-2.5'>
                <a href="" className="flex items-center relative gap-2 text-black ">
                    <img src={placeholder} alt="profile_picture" className='rounded-full w-7 aspect-square object-contain' />
                    <p className='text-black  w-20 -words overflow-wrap-anywhere whitespace-normal text-xs leading-tight
                    special_underline no-repeat center/contain;'>{username}</p>
                </a>
            </div>
            <div className='flex gap-2 m-2.5'>
                <a href=""><img src={add} alt="add" /></a>
                <a href=""><img src={like} alt="like" /></a>
            </div>
        </div>
    );

}

export default PostBar;
