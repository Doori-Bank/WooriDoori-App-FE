import React from 'react';
import { Payment } from './detail';

interface PaymentListByDateProps {
  groupedPayments: [string, Payment[]][];
  year: number;
  month: number;
  dateRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onPaymentClick: (day: string, payment: Payment) => void;
  getCategoryIcon: (category: string) => string | React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const PaymentListByDate: React.FC<PaymentListByDateProps> = ({
  groupedPayments,
  year,
  month,
  dateRefs,
  onPaymentClick,
  getCategoryIcon,
}) => {
  return (
    <>
      {groupedPayments.map(([day, payments]) => {
        const date = new Date(year, month, parseInt(day));
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

        return (
          <div
            key={day}
            ref={(el) => (dateRefs.current[day] = el)}
            className="mb-8 scroll-mt-[14rem]"
          >
            <div className="mb-4 text-xl font-medium text-gray-600 dark:text-gray-300">
              {day}일 {dayOfWeek}요일
            </div>
            {payments.map((payment, idx) => (
              <div
                key={idx}
                onClick={() => onPaymentClick(day, payment)}
                className="flex gap-4 items-center p-4 mb-3 bg-white rounded-2xl shadow-sm transition-shadow cursor-pointer dark:bg-gray-600 hover:shadow-md dark:hover:shadow-lg"
              >
                <div 
                  className="flex flex-shrink-0 justify-center items-center w-20 h-20 rounded-full"
                  style={{ backgroundColor: `#${payment.categoryColor}` }}
                >
                  <img
                    src={getCategoryIcon(payment.category) as any}
                    alt={payment.category}
                    className="object-contain w-12"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {(() => {
                      const displayAmount = payment.dutchPay && payment.dutchPay > 1 
                        ? Math.ceil(payment.amount / payment.dutchPay) 
                        : payment.amount;
                      return displayAmount.toLocaleString();
                    })()} 원
                    {payment.dutchPay && payment.dutchPay > 1 && (
                      <span className="ml-2 text-base text-blue-500">({payment.dutchPay}인)</span>
                    )}
                  </div>
                  <div className="text-xl text-gray-500 dark:text-gray-400">{payment.company}</div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

export default PaymentListByDate;

