import React from 'react'
import './RecipeInfo.css'

function RecipeInfo({setToggleVisibility, recipeName, recipeDesc, recipeIng, recipeInstr, recipeImg}) {
  return (
    <div className='recipe-info-container'>
        <div className='info-container'>
            <button onClick={() => setToggleVisibility(false)} className='exit-info-btn'>X</button>
            <img className='recipe-img' src={recipeImg}/>
            <div className='recipe-desc-container'>
              <div className='recipe-name'>{recipeName}</div>
              <div className='recipe-desc'>{recipeDesc}</div>
              <div className='desc-label'>Ingredients:</div>
              <div className='recipe-desc'>{recipeIng.map(ingredients => <div>{ingredients}</div>)}</div>
              <div className='desc-label'>Instructions:</div>
              <div className='recipe-desc'>{recipeInstr.map(instructions => <div>{instructions}</div>)}</div>
            </div>
            
        </div>
    </div>
  )
}

export default RecipeInfo