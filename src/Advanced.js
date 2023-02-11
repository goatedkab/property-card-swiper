import React, { useState, useEffect, useMemo, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import ImageSlider from './ImageSlider'




const db = [
  {
    name: '2 bedroom flat',
    images: [ 
    {url: 'https://media.rightmove.co.uk/49k/48618/131138630/48618_KNI230006_L_IMG_00_0000.jpeg', title: 'Beach'},
    {url: 'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg', title: 'Gang'},
    {url: 'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg', title: 'Peak'}]
  },
  {
    name: '1 bedroom flat',
    images: [ 
    {url: 'https://media.rightmove.co.uk/90k/89893/116731484/89893_1013_IMG_03_0000.jpeg', title: 'Beach'},
    {url: 'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg', title: 'Gang'},
    {url: 'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg', title: 'Peak'}]
  },
  {
    name: 'terraced bungalow',
    images: [ 
    {url: 'https://media.rightmove.co.uk/49k/48618/131138630/48618_KNI230006_L_IMG_00_0000.jpeg', title: 'Beach'},
    {url: 'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg', title: 'Gang'},
    {url: 'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg', title: 'Peak'}]
  },
  {
    name: 'new big house',
    images: [ 
    {url: 'https://media.rightmove.co.uk/90k/89893/116731484/89893_1013_IMG_03_0000.jpeg', title: 'Beach'},
    {url: 'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg', title: 'Gang'},
    {url: 'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg', title: 'Peak'}]
  },
  {
    name: 'little house',
    images: [ 
    {url: 'https://media.rightmove.co.uk/49k/48618/131138630/48618_KNI230006_L_IMG_00_0000.jpeg', title: 'Beach'},
    {url: 'https://media.rightmove.co.uk/50k/49389/130844048/49389_ONS1989876_IMG_00_0000.jpeg', title: 'Gang'},
    {url: 'https://media.rightmove.co.uk/66k/65875/131154665/65875_KNQ012358686_IMG_00_0000.jpeg', title: 'Peak'}]
  }
]

function Advanced () {


  const [currentIndex, setCurrentIndex] = useState(db.length - 1)
  const [lastDirection, setLastDirection] = useState()
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < db.length - 1

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
    if (canSwipe && currentIndex < db.length) {
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

  // {db.map((character, index) => (console.log(character.images)))}

  return (
    <div>

      <h1>GET A FLAT NOW</h1>

      <div className='cardContainer'>

        {db.map((character, index) => (

          <TinderCard
            ref={childRefs[index]}
            className='swipe'
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div className='card'>
            <ImageSlider slides = {character.images}/>   
            <h3>{character.name}</h3>   
            </div>
          </TinderCard>
        ))}

      </div>

      <div className='buttons'>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')}>Swipe left!</button>
        <button style={{ backgroundColor: !canGoBack && '#c3c4d3' }} onClick={() => goBack()}>Undo swipe!</button>
        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')}>Swipe right!</button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}

    </div>
  )
}

export default Advanced
