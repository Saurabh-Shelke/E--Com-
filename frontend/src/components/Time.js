import React, { useState, useEffect } from 'react';

const SaleBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [prevTime, setPrevTime] = useState(timeLeft);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const countdownDate = new Date();
      countdownDate.setDate(countdownDate.getDate() + 30);
      countdownDate.setHours(23, 59, 59);
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(timerId);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (
          seconds !== timeLeft.seconds ||
          minutes !== timeLeft.minutes ||
          hours !== timeLeft.hours
        ) {
          setPrevTime(timeLeft);
        }

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateCountdown();
    const timerId = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const TimerBlock = ({ label, value, prevValue }) => {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-20 sm:w-20 sm:h-24 lg:w-24 lg:h-28 bg-white rounded-lg overflow-hidden shadow-lg">
          <div className={`absolute w-full h-full bg-red-600 text-white text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center ${value > prevValue ? 'animate-expand' : 'animate-shrink'}`}>
            {value}
          </div>
        </div>
        <p className="text-white mt-1 sm:mt-2 lg:mt-2 text-sm sm:text-base lg:text-lg font-semibold">{label}</p>
      </div>
    );
  };

  return (
    <div className="bg-red-600  sm:py-1 lg:py-3 px-6 sm:px-12 lg:px-24 flex  flex-col justify-center items-center rounded-lg shadow-lg animate-pulse max-w-full lg:max-w-5xl mx-auto mt-10 mb-10"> {/* Added margin-top here */}
      <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 lg:mb-6 text-center">Sale Ends In</h2>
      <div className="flex space-x-4 sm:space-x-6 lg:space-x-8">
        <TimerBlock label="Days" value={timeLeft.days} prevValue={prevTime.days} />
        <TimerBlock label="Hrs" value={timeLeft.hours} prevValue={prevTime.hours} />
        <TimerBlock label="Min" value={timeLeft.minutes} prevValue={prevTime.minutes} />
        <TimerBlock label="Sec" value={timeLeft.seconds} prevValue={prevTime.seconds} />
      </div>
    </div>
  );
};

export default SaleBanner;
