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
    isEditMode?: boolean,
    onEdit?: () => void,
    onDelete?: () => void,
    onEditTitle?: () => void,
    isEditingTitle?: boolean,
    onSaveTitle?: (newTitle: string) => void,
    onCancelEdit?: () => void,
    onEditNickname?: () => void,
}

const MyCardBox = ({src,alt,title,cardName,cardNum,content, isEidit = false, isEditMode = false, onEdit, onDelete, onEditTitle, isEditingTitle = false, onSaveTitle, onCancelEdit, onEditNickname}: props) => {

    return (
        <div className="border-b border-[#F2F2F2] w-full my-4 pt-3 pb-6 border-box flex flex-col gap-3 items-start">
            {/* 타이틀 */}
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                    {isEditingTitle ? (
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                defaultValue={title}
                                className="font-semibold text-[1.8rem] text-[#4A4A4A] border-0 border-b border-gray-300 bg-transparent px-1 py-0 focus:outline-none focus:border-gray-500"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSaveTitle?.(e.currentTarget.value);
                                    } else if (e.key === 'Escape') {
                                        onCancelEdit?.();
                                    }
                                }}
                                autoFocus
                            />
                            <IconButton src={img.EditIcon} alt="저장" width={15} height={15} onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                onSaveTitle?.(input.value);
                            }} />
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <h1 className="font-semibold text-[1.8rem] text-[#4A4A4A]">{title}</h1>
                            {isEditMode ? <IconButton src={img.EditIcon} alt="수정" width={18} height={18} onClick={onEditNickname} /> : null}
                        </div>
                    )}
                </div>
                {isEditMode && (
                    <div className="flex items-center -mr-10">
                        <IconButton src={img.DeleteIcon} alt="삭제" width={15} height={15} onClick={onDelete} />
                    </div>
                )}
            </div>

            {/* 카드 정보 */}
            <span className="flex gap-5 items-center w-full">
                <span className="flex-1 max-w-[10rem] h-[6rem]">
                    <img src={src} alt={alt} className="object-contain w-full h-full" />
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