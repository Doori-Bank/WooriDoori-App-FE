import { CardValidationErrors } from "@/utils/card/cardValidation"
import React from "react"

export const CardNumInput = ({ onClick, cardNumList, errors }: { onClick: () => void, cardNumList: string[], errors: CardValidationErrors }) => {
  return (
    <div>
      <div
        className={`
          flex items-center px-3 w-full h-[3rem] text-[1.2rem] text-gray-800 rounded-lg border 
          cursor-pointer focus:outline-none 
          ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'}
        `}
        onClick={onClick}
      >
        {cardNumList.map((part, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-1 justify-center items-center">
              <span className={`text-[1.2rem] font-medium ${part ? 'text-black':'text-gray-400'}`}>
                {part || '4자리'}
              </span>
            </div>
            {index < 3 && (
              <div className="flex justify-center items-center w-4">
                <span className="text-gray-400 text-[1rem] font-medium">-</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {
        errors.cardNumber && (
          <p className="mt-2 text-red-500">{errors.cardNumber}</p>
        )
      }
    </div >
  )
}