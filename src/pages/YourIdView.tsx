import { img } from "@/assets/img";
import DefaultButton from "@/components/button/DefaultButton";
import DefaultDiv from "@/components/default/DefaultDiv";
import Title1 from "@/components/title/Title1";

const YourIdView = () => {
  // 예시: 백엔드에서 받아오는 이메일
  const email = "hongseok@gmail.com";

  // 이메일 마스킹 함수 (처음 3자리만 보여주고 나머지 * 처리)
  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (name.length <= 3) return `${name[0]}***@${domain}`;
    const visible = name.slice(0, 3); // 처음 3자리
    const masked = "*".repeat(name.length - 3); // 나머지 마스킹
    return `${visible}${masked}@${domain}`;
  };

  return (
    <DefaultDiv>
      <div className="h-16" />
      <img src={img.wooridoorilogo} alt="" className="w-60 mx-auto" />
      <div className="h-8" />

      <div className="text-center">
        <Title1 text="아이디 찾기" />
        <div className="h-4" />
        <h3>회원님의 아이디를 찾았어요👏</h3>

        <div className="h-16" />
        <div className="relative w-[300px] h-[250px] mx-auto">
          <img
            src={img.goindol}
            alt="고인돌 이미지"
            className="w-full h-full object-none"
          />
          <p className="absolute left-1/2 top-1/4 -translate-x-1/2 text-white text-3xl font-bold">
            {maskEmail(email)}
          </p>
        </div>

        <div className="h-24" />
        <div className="flex justify-center pt-4">
          <DefaultButton
            text="확인"
            onClick={() => (window.location.href = "/login")}
          />
        </div>
      </div>
    </DefaultDiv>
  );
};

export default YourIdView;
