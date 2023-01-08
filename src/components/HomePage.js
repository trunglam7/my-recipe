import React, {useState, useEffect} from 'react'
import './HomePage.css'
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import RecipeCard from './RecipeCard';

function HomePage({auth, user, app, storage}) {

  //defining variables and states
  const dialog = document.getElementById('addRecipeDialog');
  const db = getFirestore(app);
  const docRef = doc(db, "users", user.uid);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');
  const [recipeIng, setRecipeIng] = useState('');
  const [recipeInstr, setRecipeInstr] = useState('');
  const [recipeImage, setRecipeImage] = useState();
  const [valid, setValid] = useState(0);
  const [loading, setLoading] = useState(false);
  
  //function to return message when no recipe list exist for user
  const nullRecipeMessage = () => {
    return(
      <div className='null-recipe-message'>
          <div>There are no recipes here...</div>
          <div>Please add some.</div>
      </div>
    )
  }

  const uploadData = (url) => {
    let data = [...recipeList, {
      rec_name: recipeName,
      rec_desc: recipeDesc,
      rec_ing: recipeIng,
      rec_instr: recipeInstr,
      rec_img: url
    }];
    setDoc(docRef, {data})
    .then(() => {
      console.log("Document Added Successfully");
      setValid(0);
    })
    .catch(error => {
      console.log(error);
    })
  }

  const uploadFile = () => {
    const file = recipeImage;
    const storageRef = ref(storage, `${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
        if(progress < 100){
          setLoading(true);
        }
        else{
          setLoading(false);
        }
      }, 
      (error) => {
        console.log(error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          uploadData(downloadURL);
        });
      }
    );
  }

  //submit handler when user enters submit
  const submitHandler = (e) => {
    e.preventDefault();
    uploadFile();
    dialog.close();
  }

  //retrieve data from firebase
  useEffect(() => {
    const dispRecipe = async () => {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        setRecipeList(docSnap.data().data);
        console.log("Document data:", docSnap.data().data);
      }
      else{
        await setDoc(docRef, {});
        console.log("No such document!");
      }
    }
    setValid(1);
    dispRecipe().catch(console.error);
  }, [valid]);

  if(!recipeList) {setRecipeList([])};
  return (
    <div className='homepage-container'>
        <div className={loading ? 'temp-cover-active' : 'temp-cover-hide'}>
          <div style={{'fontWeight': 'bold', 'fontSize': '30px'}}>Loading...</div>
        </div>
        <nav className='login-nav-header'>
              <div className='website-name'>My Recipes</div>
              <div className='right-side'>
                <div className='user-name'>Welcome! {user.displayName}</div>
                <button className='recipe-btn' onClick={() => auth.signOut()}>Sign Out</button>
              </div>
        </nav>
        <main className='homepage-main'>
          <dialog id='addRecipeDialog'>
            <div style={{'fontWeight':'bold'}}>Add Recipe</div>
            <form>
              <div>
                <div><label htmlFor="rec_name">Recipe Name:</label></div>
                <input type='text' id='rec_name' name='rec_name' placeholder='Recipe Name' required onChange={e => setRecipeName(e.target.value)}/>
              </div>
              <div>
                <div><label htmlFor="rec_desc">Recipe Description:</label></div>
                <input type='text' id='rec_desc' name='rec_desc' placeholder='Recipe Description' required onChange={e => setRecipeDesc(e.target.value)}/>
              </div>
              <div>
                <div><label htmlFor="rec_ing">Recipe Ingredients (Seperate with commas):</label></div>
                <input type='text' id='rec_ing' name='rec_ing' placeholder='Recipe Ingredients' required onChange={e => setRecipeIng(e.target.value.split(',').map(element => element.trim()))}/>
              </div>
              <div>
                <div><label htmlFor="rec_ing">Recipe Instructions (Seperate with commas):</label></div>
                <input type='text' id='rec_instr' name='rec_instr' placeholder='Recipe Instructions' required onChange={e => setRecipeInstr(e.target.value.split(',').map(element => element.trim()))}/>
              </div>
              <div>
                <div><label htmlFor="rec_img">Select Image for Recipe:</label></div>
                <input type='file' id='rec_img' name='rec_img' accept='image/*' onChange={e => setRecipeImage(e.target.files[0])}/>
              </div>
              <div className='dialog-btn-container'>
                <button className='recipe-btn' type='submit' onClick={submitHandler}>Submit</button>
                <button className='recipe-btn' onClick={(e) => {e.preventDefault(); console.log("Cancel Pressed"); dialog.close();}}>Cancel</button>
              </div>
            </form>
          </dialog>
          <nav className='homepage-side-nav'>
            <button className='recipe-btn' onClick={() => dialog.showModal()}>Add Recipe</button>
          </nav>
          <div className='recipe-main'>
            <div className='recipes-container'>
              {
                recipeList && recipeList.length ? recipeList.map(x => <RecipeCard key={Math.random()} recipeName={x.rec_name} recipeDesc={x.rec_desc} recipeIng={x.rec_ing} recipeInstr={x.rec_instr} recipeImg={x.rec_img}/>) : nullRecipeMessage()
              }
            </div>
          </div>
          
        </main>
    </div>
  )
}

export default HomePage