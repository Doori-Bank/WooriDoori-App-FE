interface props {
  href: string,
  src: string,
  alt: string,
  title: string,
  content: string,
  subtitle: string,
  categoryList: category[],
}

interface category {
  title: string;
  color: string;
}


const CardDescriptionBox = ({ href,src, alt, title, content, subtitle, categoryList }: props) => {

  // 카테고리 위젯
  const CategoryWidget = ({ title, color }: { title: string, color: string }) => {
    return (
      <div
        style={{
          border: `1px solid ${color}`,
          backgroundColor: `${color}50`, // 투명도 있는 배경
          color: color,
        }}
        className={`round-10 border px-2 py-1 text-[1rem] font-medium`}>#{title}</div>
    )
  }

  return (
    <a href={href}>
      <div className="border-b border-[#F2F2F2] w-full my-6 pt-3 pb-9 border-box flex gap-4 items-center">
        {/* 카드 이미지 */}
        <span className="flex-1 max-w-[15rem] h-[11rem]">
          <img src={src} alt={alt} className="w-full h-full bg-black object-contain" />
        </span>

        {/* 카드 타이틀 */}
        <span className="flex-1 flex flex-col">
          <h1 className="font-medium text-[2rem] text-black">{title}</h1>
          <h3 className="mt-2 font-normal text-[1.2rem] text-[#858585]" style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
          }}>{content}</h3>
          <h4 className="mt-3 font-normal text-[1rem] text-[#B6B6B6]" style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            overflow: 'hidden',
          }}>{subtitle}</h4>

          <div className="mt-3 flex gap-3">
            {
              categoryList.map((element, index) => {
                return <CategoryWidget key={index} title={element.title ?? ''} color={element.color ?? '#000'} />;
              })
            }
          </div>
        </span>
      </div>
    </a>
  )
}

export default CardDescriptionBox;