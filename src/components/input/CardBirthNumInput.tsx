import { CardValidationErrors } from "@/utils/card/cardValidation";
import InputBox from "./InputBox";

export const CardBirthNumInput = (
  {birthDate, setBirthDate, errors,}:
  {birthDate:string, setBirthDate:(e: string)=>void, errors :CardValidationErrors}
) => {
  return (
    <>

      <div className="flex gap-4 items-center">
        <InputBox
          type="text"
          placeholder="000000"
          value={birthDate.slice(0, 6)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setBirthDate(value + birthDate.slice(6));
          }}
          className={`w-full flex-1
               focus:outline-none ${errors.birthDate ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}

        />
        <span className="text-gray-400 text-[1rem]">-</span>
        <InputBox
          type="text"
          placeholder="0"
          value={birthDate.slice(6, 7)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 1);
            setBirthDate(birthDate.slice(0, 6) + value);
          }}
          bgColor='bg-white'
          className={`w-[2rem] max-w-[4rem] text-center focus:outline-none 
              ${errors.birthDate ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}
            `}
        />
        <div className="flex gap-5 ml-4">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
      {errors.birthDate && (
        <p className="mt-2 text-red-500">{errors.birthDate}</p>
      )}
    </>
  )
}