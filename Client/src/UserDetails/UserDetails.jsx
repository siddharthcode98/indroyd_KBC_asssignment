import { useEffect, useState } from "react";
import { Oval } from "react-loading-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { io } from "socket.io-client";

const socket = io("wss://indroyd-kbc-asssignment.onrender.com/");

export default function UserDetails() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [info, setInfo] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState([]);
  const [seconds, setSeconds] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [winner, setWinner] = useState();
  const [answered, setAnswered] = useState(false);

  const [isGameOver, setGameOver] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && room) {
      setInfo(true);
    }
  };

  useEffect(() => {
    if (seconds === 0) return;

    const timerInterval = setInterval(() => {
      setSeconds((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [seconds]);

  useEffect(() => {
    if (name) {
      socket.emit("joinRoom", room, name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  useEffect(() => {
    socket.on("message", (message) => {
      toast(`${message} joined`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    socket.on("newQuestion", (data) => {
      setQuestion(data.question);
      setOptions(data.options);
      setSeconds(data.timer);
      setAnswered(false);
      setSelectedOption();
    });
    socket.on("answerResult", (data) => {
      if (data.isCorrect) {
        toast(`correct ${data.playerName} got it right!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setScores(data.scores);
    });
    socket.on("gameOver", (data) => {
      setWinner(data.winner);
    });

    return () => {
      socket.off("newQuestion");
      socket.off("answerResult");
      socket.off("gameOver");
    };
  }, []);

  const handleAns = (ans) => {
    if (!answered) {
      setSelectedOption(ans);
      socket.emit("submitAnswer", room, ans);
      setAnswered(!answered);
    }
    if (winner) {
      setGameOver(!isGameOver);
    }
  };

  return (
    <div>
      {!info ? (
        <div className="bg-kbc-color2 h-screen w-full  flex flex-col justify-center bg-contain p-3">
          <div className="bg-gradient-to-r from-kbc-color1 to-kbc-color2 h-[300px] flex flex-col justify-center rounded-2xl shadow-md  text-cyan-50 gap-3 p-2 md:ml-[25%] md:mr-[25%]  ">
            <h1 className="text-center font-bold text-lg ">
              Enter your Details
            </h1>
            <form className="flex flex-col  gap-3 " onSubmit={handleSubmit}>
              <div className=" flex flex-col p-2 rounded-md gap-2 ">
                <label id="name">Name</label>
                <input
                  htmlFor="name"
                  placeholder="Enter Your Name"
                  className=" bg-kbc-color1 p-1  border-kbc-color2 border-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className=" flex flex-col p-2 rounded-md  gap-2">
                <label id="room">Room Id</label>
                <input
                  htmlFor="room"
                  placeholder="Enter Your room Id"
                  className=" bg-kbc-color1 p-1 border-kbc-color2 border-2"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-kbc-color2 text-white p-2 rounded-md"
                >
                  JOIN
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-kbc-color1 to-kbc-color2 h-screen w-full bg-cover p-5">
          <div className="p-5 flex flex-col bg-kbc-color1  shadow-xl rounded-xl">
            <h1 className="text-center font-bold text-2xl text-white">
              KBC QUIZ
            </h1>
            <div className="flex  justify-between pt-3 pb-3">
              <p className="bg-yellow-300 p-2 rounded-xl text-kbc-color2">
                Room ID:{room}
              </p>
              <p className="bg-yellow-300 p-2 rounded-xl text-kbc-color2">
                Remaining Time:{seconds}
              </p>
            </div>

            <ToastContainer />
            {question ? (
              <div>
                <div className="flex flex-col gap-3  ">
                  <p className=" bg-purple-800 text-white p-5 rounded-lg text-center">
                    {question}
                  </p>
                  <ul className="grid md:grid-cols-2 md:grid-rows-4 gap-3">
                    {options.map((option, index) => (
                      <li key={index} className="">
                        <button
                          onClick={() => handleAns(option)}
                          className={`bg-purple-800 rounded-md text-white p-3 text-center w-full hover:bg-neutral-200 hover:text-kbc-color2 ${
                            selectedOption === option ? "text-green-700" : ""
                          }`}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="absolute top-1/2 left-1/2">
                <Oval />
              </div>
            )}
          </div>
          <div className="p-5 mt-5 text-white flex flex-col bg-kbc-color1  shadow-xl rounded-xl">
            <h1 className="text-xl text-center">Player Details</h1>
            <ul>
              {scores.map((player, index) => (
                <li key={index}>
                  <p className="text-xl font-bold ">
                    <span className="font-normal ">{player.name}</span>
                    <span>{player.score}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {isGameOver && (
            <div className="p-5 mt-5 text-white flex flex-col bg-kbc-color1  shadow-xl rounded-xl">
              <p className="font-bold text-3xl text-white text-center ">
                {winner} is the winner!!!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
