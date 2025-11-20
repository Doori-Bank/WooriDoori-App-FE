import { img } from "@/assets/img";
import IconButton from "../button/IconButton";
import { formatCardNumber } from "@/utils/card/CardUtils";

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

const MyCardBox = ({src,alt,title,cardName,cardNum,content, isEditMode = false, onDelete, isEditingTitle = false, onSaveTitle, onCancelEdit, onEditNickname}: props) => {

    return (
        <div className="flex overflow-hidden relative flex-col w-full">
            {/* 그라데이션 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br opacity-60"></div>
            
            {/* 메인 컨텐츠 */}
            <div className="flex relative flex-col gap-3 px-6 py-6 w-full">
                {/* 헤더 영역 */}
                <div className="flex justify-between items-start w-full">
                    <div className="flex-1 min-w-0">
                        {isEditingTitle ? (
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    defaultValue={title}
                                    className="font-bold text-[1.6rem] text-gray-800 border-0 border-b-2 border-blue-400 bg-transparent px-2 py-1 focus:outline-none focus:border-blue-600 transition-colors"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onSaveTitle?.(e.currentTarget.value);
                                        } else if (e.key === 'Escape') {
                                            onCancelEdit?.();
                                        }
                                    }}
                                    autoFocus
                                />
                                <IconButton src={img.EditIcon} alt="저장" width={16} height={16} onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    onSaveTitle?.(input.value);
                                }} />
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <h1 className="font-bold text-[1.6rem] text-gray-800 truncate">{title}</h1>
                                {isEditMode && (
                                    <button
                                        onClick={onEditNickname}
                                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <IconButton src={img.EditIcon} alt="수정" width={14} height={14} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {isEditMode && (
                        <button
                            onClick={onDelete}
                            className="flex-shrink-0 p-2 ml-2 rounded-lg transition-colors hover:bg-red-100"
                        >
                            <IconButton src={img.DeleteIcon} alt="삭제" width={16} height={16} />
                        </button>
                    )}
                </div>

                {/* 카드 이미지 및 정보 영역 */}
                <div className="flex relative gap-8 items-center p-1 w-full">
                    {/* 카드 이미지 */}
                    <div className="overflow-hidden flex-shrink-0 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md w-42">
                        <img 
                            src={src} 
                            alt={alt} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = img.cardExample;
                            }}
                        />
                    </div>
                    
                    {/* 카드 정보 */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-2">
                            <p className="font-bold text-[1.5rem] text-gray-800 truncate">{cardName}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="flex gap-2 items-center px-3 py-1 bg-gray-100 rounded-md">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <p className="font-medium text-[1.2rem] text-gray-600 tracking-wider">
                                    {formatCardNumber(cardNum)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 혜택 영역 */}
                <div className="relative p-4 bg-gradient-to-r border-t">
                    <div className="flex gap-2 items-center mb-2">
                        <div className="flex justify-center items-center w-6 h-6 bg-green-700 rounded-full">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="font-bold text-[1.3rem] text-gray-800">카드 주요 혜택</p>
                    </div>
                    <p 
                        className="font-medium text-[1.1rem] text-gray-400 leading-relaxed"
                        style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                        }}
                    >
                        {content}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MyCardBox;