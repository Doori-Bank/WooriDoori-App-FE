interface Payment {
  merchant: string;
  company: string;
  amount: number;
  reward: number;
}

interface PayMentListProps {
  paymentList: [string, Payment[]][];
  year: number;
  month: number;
  dateRefs: React.MutableRefObject<any>;
  setDetail: (detail: any) => void;
  naverRound: string;
  cardIcon: string;
}

const PayMentList: React.FC<PayMentListProps> = ({paymentList, year, month, dateRefs, setDetail, naverRound, cardIcon}) =>{
    return (
        <div className="px-5 pb-5">
        {paymentList.map(([day, payments]) => {
          const date = new Date(year, month, parseInt(day));
          const dayOfWeek = ['일','월','화','수','목','금','토'][date.getDay()];

          return (
            <div key={day} ref={(el) => (dateRefs.current[day] = el)} className="mb-6">
              <div className="text-sm text-gray-400 mb-3 font-medium">{day}일 {dayOfWeek}요일</div>

              {payments.map((payment, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-4 bg-white rounded-xl mb-2 shadow gap-3 cursor-pointer"
                  onClick={() => setDetail({ day, data: payment })}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${payment.merchant.includes('네이버페이') ? 'overflow-hidden' : 'bg-blue-500'}`}>
                    <img
                      src={payment.merchant.includes('네이버페이') ? naverRound : cardIcon}
                      alt={payment.merchant.includes('네이버페이') ? 'naver' : 'card'}
                      className={payment.merchant.includes('네이버페이') ? 'w-full h-full' : 'w-[26px] h-[18px]'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold mb-1">{payment.amount.toLocaleString()} 원</div>
                    <div className="text-sm text-gray-400">{payment.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold">{payment.merchant}</div>
                    {payment.reward > 0 && <div className="text-sm text-green-500">+{payment.reward.toLocaleString()}원</div>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
}