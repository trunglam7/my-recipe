import React, {useState} from 'react'
import './RecipeCard.css'
import RecipeInfo from './RecipeInfo'

function RecipeCard({recipeName, recipeDesc, recipeIng, recipeInstr, recipeImg}) {

  const [toggleVisibility, setToggleVisibility] = useState(false);

  const displayRecipe = () => {
    setToggleVisibility(true);
  }

  return (
    <>
      <div className='recipe-card-container' onClick={() => displayRecipe()}>
        <img className='recipe-img' src={recipeImg} />
        <div className='recipe-name'>{recipeName}</div>
      </div>
      <div className={toggleVisibility ? 'recipe-info-popup' : 'recipe-info-hidden'}>
        <RecipeInfo setToggleVisibility={setToggleVisibility} recipeName={recipeName} recipeDesc={recipeDesc} recipeIng={recipeIng} recipeInstr={recipeInstr} recipeImg={recipeImg}/>
      </div>
    </>
    
  )
}

export default RecipeCard