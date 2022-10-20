import { useEffect, useState, useRef } from "react";
import './App.css';
import logo from './mlh-prep.png'

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City")
  const [results, setResults] = useState(null);
  const [activeHour, setActiveHour] = useState(null);
  const ref = useRef(); 
  

  const formatDate = (date) => {
    date = date.dt_txt.slice(5, 10)
    return date.replace("-", "/")
  } 

  const formatTime = (time) => {
    time = parseInt(time.dt_txt.slice(11,13), 10)
    return (time > 12) ? `${time - 12}PM` : `${time}AM`
  }

  let activeDate;
  let dateArray = [];

  const pullDates = (listObject) => {
    let date = listObject.dt_txt.slice(0, 10);
    if (!dateArray.includes(date)) { 
      dateArray.push(date);
    }
}

let arr = [];

const pullHours = (listObject) => {
  let hourlyItem = listObject.dt_txt.slice(0, 10)
  if (hourlyItem.includes(activeDate)) {
    arr.push(listObject);
  }
  return arr;
}

  const showDates = (object) => {
    for (let i = 0; i < object.length - 1; i++) {
      pullDates(object[i])
      activeDate = dateArray[0];
      pullHours(object[i])
    }
  }

  useEffect(() => {
    fetch("https://pro.openweathermap.org/data/2.5/forecast/hourly?q=" + city + "&units=metric" + "&appid=" + process.env.REACT_APP_APIKEY)
      .then(res => res.json())
      .then(
        (result) => {
          if (parseInt(result['cod']) !== 200) {
            setIsLoaded(false)
          } else {
            setIsLoaded(true);
            setResults(result);
            showDates(results.list);
            setActiveHour(arr[0]);
            console.log(activeHour);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [city])

  // useEffect(() => {
  //   arr = [];
  //   for (let i = 0; i < 95; i++) {
  //     pullHours(results.list[i])
  //   }
  // })

  const handleHourClick = () => {
    setActiveHour(ref.current.hour);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    showDates(results.list);
    console.log(activeHour);
    return <>
      <img className="logo" src={logo} alt="MLH Prep Logo"></img>
      <div>
        <h2>Enter a city below 👇</h2>
        <input
          type="text"
          value={city}
          onChange={event => setCity(event.target.value)} />
        <div className="Results">
          {!isLoaded && <h2>Loading...</h2>}
          {/* {console.log(results)} */}
          {isLoaded && results && <>
            <h3>{activeHour.weather[0].main}</h3>
            <p>Feels like {activeHour.main.feels_like}°C</p>
            <i><p>{results.city.name}, {results.city.country}</p></i>
            <i><p>{formatDate(activeHour)} | {formatTime(activeHour)}</p></i>
            <div>
              <div >
                <button>{dateArray[0]}</button>
                <button>{dateArray[1]}</button>
                <button>{dateArray[2]}</button>
                <button>{dateArray[3]}</button>
                <button>{dateArray[4]}</button>
              </div>
              <select>
                {arr.map(hourItem => <option ref={ref} hour={hourItem} onClick={handleHourClick}>{formatTime(hourItem)}</option>)}
              </select>
            </div>
          </>}
        </div>
      </div>
    </>
  }
}

export default App;
