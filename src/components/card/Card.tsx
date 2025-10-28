import React from 'react';

interface CardProps {
  rank: number;
  title: string;
  subtitle: string;
  buttonText: string;
  cardImageSrc: string;
  buttonOnClick: () => void;
}

const Card: React.FC<CardProps> = ({ rank ,title, subtitle, buttonText, cardImageSrc, buttonOnClick }) => {
  return (
    <div className="flex items-center justify-center gap-20">
      <img src={cardImageSrc} alt="card" className="w-36 h-auto object-contain card-rotate-3d" />
      <div>
        <div className="text-start">
          <h1 className='text-[1.8rem] text-[#8BC34A] font-extrabold'>{rank}위</h1>
          <h2 className="text-[1.8rem] font-normal mb-2 whitespace-pre-line">{title}</h2>
          <p className="text-[1.2rem] text-gray-500">{subtitle}</p>
        </div>
        <button
          onClick={buttonOnClick}
          className="mt-8 bg-[#8BC34A] text-white px-10 py-2 rounded-full"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;