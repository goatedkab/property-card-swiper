import { useState, useEffect } from 'react';
import './ImageSlider.css';
import keydown from 'react-keydown';



 
const ImageSlider = ({slides}) => {


    const [currentIndex, setCurrentIndex] = useState(0); 

    const  slideStyles = {
        width: '100%', 
        height: '100%',
        borderRadius: '10px',
        backroundPosition: 'center', 
        backgroundSize: "cover",
        backgroundImage: `url( ${slides[currentIndex]})` //add.url if it were an object
    }

    const  dotStyles = {
        width: '9px',
        height: '9px',
        backgroundColor: 'rgba(254, 254, 254, 0.812)',
        borderRadius: '50%',
        cursor: 'pointer',
        margin: '0 4px',
        }

    const goToSlide = slideIndex =>  {
        setCurrentIndex(slideIndex);
    }

    
    const goToPrevious = () => {
         const isFirstSlide = currentIndex === 0
         const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        console.log('image index is', newIndex)

    }
    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1; //the colon is else statement  
       setCurrentIndex(newIndex);
       console.log('image index is', newIndex)
   }



   useEffect(() => {
    const keyDownHandler = event => {
    //   console.log('User pressed: ', event.key);

      if (event.key === 'ArrowRight') {
        event.preventDefault();

        // 👇️ your logic here
        goToNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();

        // 👇️ your logic here
        goToPrevious();
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });






    return (
    <div className='slider'>
            <div className='slider__leftArrow'  onClick = {goToPrevious}>←</div>
            <div className='slider__rightArrow' onClick = {goToNext}>→</div>
        <div style= {slideStyles}></div>
            <div className='slider__dotsContainer'>
                {slides.map((slide, slideIndex) => (
                <div key={slideIndex} onClick = {() => goToSlide(slideIndex) }>
                    {/* <div style= {dotStyles}></div> */}
                    <div className={currentIndex === slideIndex ? "slider__dotActive" : "slider__dot"}></div>

            </div>
                ))}
            </div>
        </div>
    )
};

export default ImageSlider