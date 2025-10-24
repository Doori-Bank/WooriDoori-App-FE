import { img } from "@/assets/img";
import IconButton from "../button/IconButton";

interface props {
    src: string,
    alt: string,
    title: string,
    cardName: string,
    cardNum: string,
    content: string,

    isEidit? : boolean,
}

const MyCardBox = ({src,alt,title,cardName,cardNum,content, isEidit = false}: props) => {

    return (
        <div className="border-b border-[#F2F2F2] w-full my-6 pt-3 pb-9 border-box flex flex-col gap-4 items-start">
            {/* 타이틀 */}
            <span className="w-full flex justify-between">
                <span className="flex">
                    <h1 className="font-semibold text-[1.8rem] text-[#4A4A4A] mr-2">{title}</h1>
                    <IconButton src={img.EditIcon} alt="수정" width={15} height={15} />
                </span>
                {isEidit ? <IconButton src={img.DeleteIcon} alt="삭제" width={15} height={15} /> : null}
                
            </span>

            {/* 카드 정보 */}
            <span className="flex gap-5 items-center w-full">
                <span className="flex-1 max-w-[10rem] h-[6rem]">
                    <img src={src} alt={alt} className="w-full h-full bg-black object-contain" />
                </span>
                <div className="flex-1">
                    <p className="font-medium text-[1.4rem] text-[#4A4A4A]">{cardName}</p>
                    <p className="font-normal text-[1.4rem] text-[#B6B6B6]">{cardNum}</p>
                </div>
            </span>

            {/* 내용 */}
            <span>
                <p className="font-bold text-[1.2rem] text-[#4A4A4A]">카드 주요 혜택</p>
                <p className="mt-1 font-normal text-[1.2rem] text-[#858585]" style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                }}>{content}</p>

            </span>
        </div>
    );
}

export default MyCardBox;