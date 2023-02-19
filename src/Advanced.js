import React, { useState, useEffect, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import ImageSlider from './ImageSlider'


import { auth, database } from './firebase';
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';




// const propertyData = [
//   {
//     name: '2 bedroom flat',
//     images: [ 'https://media.rightmove.co.uk/49k/48618/131138630/48618_KNI230006_L_IMG_00_0000.jpeg',
//     'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg',
//     'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg']
//   },
//   {
//     name: '1 bedroom flat',
//     images: [ 
//     'https://media.rightmove.co.uk/90k/89893/116731484/89893_1013_IMG_03_0000.jpeg',
//     'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg',
//     'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg']
//   },
//   {
//     name: 'terraced bungalow',
//     images: [ 
//     'https://media.rightmove.co.uk/49k/48618/131138630/48618_KNI230006_L_IMG_00_0000.jpeg',
//     'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg',
//     'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg']
//   }
// ]


function Advanced () {


    const [propertyData, setPropertyData] = useState([  {
      name: '1',
      images: []
    },
    {
      name: '2',
      images: []
    },
    {
      name: '3',
      images: []
    },
    {
      name: '4',
      images: []
    },
    {
      name: '5',
      images: []
    }
    ]);

    console.log(propertyData.slice(0,3))

    useEffect(() => 
    {    
        const unsubscribe = onSnapshot(collection(database, "properties"), (snapshot) => {
          setPropertyData(snapshot.docs.map(doc => doc.data()).slice(0,5));
        }); 
    
        return () => {
            //this is the cleanup...
            unsubscribe(); 
        }
    }, []);



    useEffect(() => {
      const keyDownHandler = event => {
      //   console.log('User pressed: ', event.key);
  
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          // 👇️ your logic here
          swipe('right');
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          // 👇️ your logic here
          swipe('left');
        }
        if (event.key === 'Backspace') {
          event.preventDefault();
  
          // 👇️ your logic here
          goBack();
        }
      };
      document.addEventListener('keydown', keyDownHandler);
  
      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    });
    



  const [currentIndex, setCurrentIndex] = useState(propertyData.length - 1)
  const [lastDirection, setLastDirection] = useState()

  
  // console.log(`current index is ${currentIndex}`)


  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  // console.log(`currentIndexRef is ${currentIndexRef}`)

  const childRefs = useMemo(
    () =>
      Array(propertyData.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )


  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val

  }

  
  const canGoBack = currentIndex < propertyData.length - 1
  console.log(`condition is ${currentIndex < propertyData.length - 1} ,  currentIndex is ${currentIndex}, and (propertyData.length - 1) is ${propertyData.length - 1} `)

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < propertyData.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  const containerStyles = {
    width: "500px",
    height: "300px",
    margin: " 0 auto",
  }


  return (
    <div>

      {/* <h1>get swipin'</h1> */}

      <div className='cardContainer'>

        {propertyData.map((property, index) => (
          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={property.name}
            onSwipe={(dir) => swiped(dir, property.name, index)}
            onCardLeftScreen={() => outOfFrame(property.name, index)}
            >
            <div className='card'>
            <ImageSlider slides = {property.images}/>  
            <div className='informationContainer'>
            <h3>{property.name}</h3>
            <h4>{property.price}</h4>
            </div> 
            </div>
          </TinderCard>
        ))}
      </div>


      <div className='buttons'>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3', boxShadow: !canSwipe && 'rgba(220, 220, 220, 0.447) 5px 5px 20px' }} onClick={() => swipe('left')}>Swipe left!</button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3', boxShadow: !canGoBack && 'rgba(220, 220, 220, 0.447) 5px 5px 20px' }} onClick={() => goBack()}>Undo swipe!</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3', boxShadow: !canSwipe && 'rgba(220, 220, 220, 0.447) 5px 5px 20px' }} onClick={() => swipe('right')}>Swipe right!</button>
      </div>
      {lastDirection ? (
        lastDirection == 'right' ? (
        <h2 key={lastDirection} className='infoText'>
          Added to your collection!
        </h2>
        ): (
        <h2 key={lastDirection} className='infoText'>
           not for me...
        </h2>)
      ) : (
        <h2 className='infoText'>
          Swipe a card, press a button, or use the arrow keys to find your dream home!
        </h2>
      )}

    </div>
  )
}

export default Advanced
