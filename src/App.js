import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, InputGroup, Row, Card, FormControl } from 'react-bootstrap';
import { useState, useEffect} from 'react';

const CLIENT_ID = "fe02a3f2e80042909eea950c952c102d";
const CLIENT_SECRET = "b426a7c4968b4289add3aad23db198da";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  // POPUP VISIBILITY AND MESSAGE
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  
  useEffect( ()=> {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result=> result.json())
      .then(data => setAccessToken(data.access_token))

  }, [])

// Taylor button
function handleTaylorSwiftButton() {
  setSearchInput("Taylor Swift");
  search();
}

function handleDrakeButton() {
  setSearchInput("Drake");
  search();
}

function handleWeekendButton() {
  setSearchInput("Weekend");
  search();
}

function handleHomePage() {
  setSearchInput("Taylor Swift");
  search();
}

{/* Search Function */}
async function search(artistName = searchInput) {
  console.log("Search for: " + artistName);

  var searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }

  /////////

  // {/* GETTING ARTIST ID FROM THE SEARCH (TOP ARTIST) */}
  // var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
  //   .then(response => response.json())
  //   .then(data => {return data.artists.items[0].id })

  var artistData = await fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(searchInput) + '&type=artist', searchParameters)
  .then(response => response.json());

  var artistID = artistData.artists.items.length > 0 ? artistData.artists.items[0].id : null;

  if (!artistID) {
    // Artist ID not found, show popup and don't proceed with fetching albums
    setPopupMessage("Artist not found");
    setShowPopup(true);
    return; // Exit the function early
  }

  ///////////

  {/* USE ARTIST ID TO GET ALBUMS */}
  var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAlbums(data.items);
    });
  {/* SHOW ALBUMS TO USER */}

  console.log("Artist ID is HERE:" + artistID)
}

  return (
    <div className="App">

      {/* /////// */}
      {/* Popup for displaying messages */}
      {showPopup && (
        <div style={{position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px', color: 'black', zIndex: 100}}>
          <p>{popupMessage}</p>
          <button onClick={() => setShowPopup(false)}>X</button>
        </div>
      )}
      {/* //////// */}
      {/* Search Bar */}
      <Container>
        <InputGroup classsName="mb-3" size="lg">
          <FormControl
            placeholder='Search for an Artist'
            type='input'
            onKeyPress={event => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button classsName="btn" onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>


      <Container className='buttons'>
        <div className="row">
          <div className="col-4">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <Button classsName="btnn" onClick={handleTaylorSwiftButton}>
                Taylor Swift
              </Button>            
            </div>
          </div>

          <div className="col-4">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <Button classsName="btnn" onClick={handleDrakeButton}>
                Drake
              </Button>            
            </div>
          </div>

          <div className="col-4">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <Button classsName="btnn" onClick={handleWeekendButton}>
                Weekend
              </Button>            
            </div>
          </div>

        </div>
      </Container>
      
      {/* Actual API calls */}
      <Container>
        <Row className="ms-2 row row-cols-1">
          {albums.map( (album, i) => {
            console.log(album);
            return (
              <Card>
                <Card.Img src={album.images[0].url}/>
                <Card.Body>
                  <Card.Title>
                    {album.name}
                  </Card.Title>
                </Card.Body>
              </Card> 

            )
            
          }
          
          )}

        </Row>
            

      </Container>
    </div>
  );
}

export default App;
