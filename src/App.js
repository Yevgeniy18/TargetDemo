import { useEffect, useRef, useState } from "react";
import { BiSolidUpArrow } from "react-icons/bi";
import { FcInfo } from "react-icons/fc";
import "./styles/index.css";
import axios from "axios";

function App() {
  // Defining variables and constants
  const [initialValue, setInitialValue] = useState(0);
  const [reached, setReached] = useState(false);
  const targetValue = 15;
  const [currentAmount, setCurrentAmount] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  const timerIdRef = useRef(null);

  // Fetching api data using axios command
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "https://alex.devel.softservice.org/testapi/"
        );
        setInitialValue(res.data.balance_usd);
        setCurrentAmount(initialValue);
      } catch (err) {
        console.log(err, "An error has occured");
      }
    };

    getData();
  }, [initialValue]);

  // Tracking the current progress value

  useEffect(() => {
    setCurrentProgress((currentAmount * 100) / targetValue);

    // Until the target isnt reached, the timeout function will run the state update every 2 seconds by 0.2

    if (!reached) {
      timerIdRef.current = setTimeout(() => {
        setCurrentAmount(currentAmount + 0.2);
      }, 2000);
      return () => {
        clearTimeout(timerIdRef.current);
      };
    }
  }, [currentAmount, currentProgress, targetValue, reached]);

  // Checking when the current amount equals the target and setting reached status to true, thus ending timeout
  useEffect(() => {
    if (parseInt(currentAmount.toFixed(2)) === targetValue) {
      setReached(true);
    }
  }, [currentAmount, reached]);

  return (
    <main className="target__wrapper">
      <div className="target__container">
        <h3>Target Indicator Demo</h3>

        <div className="progress__bar__container">
          <div className="progress__bar__inner">
            <div className="progress__bar__amount">
              <div className="horizontal-container">
                <h4>Reached:</h4>

                <div className="progress__bar__animation__container">
                  <div className="progress__container">
                    <div
                      className="progress__bar"
                      style={{ width: `${currentProgress}%` }}
                    >
                      <div
                        className={`tracking__box ${
                          currentAmount > initialValue ? "to-left" : "same"
                        } `}
                      >
                        <div className="tracking__box-content">
                          <div className="content__icon">
                            <BiSolidUpArrow />
                          </div>
                          <div className="content__amount">
                            $
                            {currentAmount > initialValue
                              ? Number(currentAmount).toFixed(2)
                              : Number(currentAmount).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`target__info__box ${
                      reached ? "complete" : "remaining"
                    }`}
                  >
                    <span>Target</span>
                    <span>{targetValue} $</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`progress__bar__info ${reached ? "hide" : "show"}`}>
              <div>
                <FcInfo />
              </div>

              {targetValue - currentAmount < 1 ? (
                <span>
                  {" "}
                  You need ${Number(targetValue-currentAmount).toFixed(2)} more to reach your target
                </span>
              ) : (
                <span>
                  {" "}
                  You need ${Number(targetValue-currentAmount).toFixed(0)} more to reach your target
                </span>
              )}
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
