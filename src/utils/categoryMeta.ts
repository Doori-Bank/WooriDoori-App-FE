import { img } from "@/assets/img";

type CategoryMeta = {
  label: string;
  color: string;
  icon: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  CAFE: { label: "카페", color: "#FFD4A3", icon: img.coffeeIcon },
  FOOD: { label: "식비", color: "#FF715B", icon: img.foodIcon },
  ALCOHOL_ENTERTAINMENT: { label: "술/유흥", color: "#D0C3FF", icon: img.entertainmentIcon },
  CONVENIENCE_STORE: { label: "편의점/마트", color: "#FFC456", icon: img.martIcon },
  EDUCATION: { label: "교육", color: "#D0FFC6", icon: img.educationIcon },
  SHOPPING: { label: "쇼핑", color: "#EDA3FF", icon: img.shoppingIcon },
  TRANSPORTATION: { label: "주유/자동차", color: "#A3D8F7", icon: img.trafficIcon },
  HOUSING: { label: "주거/관리", color: "#6B5DD3", icon: img.residenceIcon },
  HOSPITAL: { label: "병원", color: "#BBFFE0", icon: img.hospitalIcon },
  TRANSFER: { label: "이체", color: "#FFF495", icon: img.transferIcon },
  TRAVEL: { label: "여행", color: "#8BD6EF", icon: img.travelIcon },
  TELECOM: { label: "통신", color: "#FFF", icon: img.phoneIcon },
  ALL: { label: "전체", color: "#C4C4C4", icon: img.etcIcon },
  ETC: { label: "기타", color: "#FFF", icon: img.etcIcon },
};

export const getCategoryMeta = (category?: string): CategoryMeta => {
  if (!category) {
    return CATEGORY_META.ETC;
  }
  const key = category.toUpperCase();
  return CATEGORY_META[key] || CATEGORY_META.ETC;
};

