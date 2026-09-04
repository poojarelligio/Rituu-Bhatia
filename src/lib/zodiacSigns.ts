import {
  ZodiacAries, ZodiacTaurus, ZodiacGemini, ZodiacCancer, ZodiacLeo, ZodiacVirgo,
  ZodiacLibra, ZodiacScorpio, ZodiacSagittarius, ZodiacCapricorn, ZodiacAquarius, ZodiacPisces,
  type LucideIcon,
} from "lucide-react";

export interface ZodiacSign {
  slug: string;
  name: string;
  symbol: string;
  dateRange: string;
  icon: LucideIcon;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { slug: "aries", name: "Aries", symbol: "♈", dateRange: "Mar 21 – Apr 19", icon: ZodiacAries },
  { slug: "taurus", name: "Taurus", symbol: "♉", dateRange: "Apr 20 – May 20", icon: ZodiacTaurus },
  { slug: "gemini", name: "Gemini", symbol: "♊", dateRange: "May 21 – Jun 20", icon: ZodiacGemini },
  { slug: "cancer", name: "Cancer", symbol: "♋", dateRange: "Jun 21 – Jul 22", icon: ZodiacCancer },
  { slug: "leo", name: "Leo", symbol: "♌", dateRange: "Jul 23 – Aug 22", icon: ZodiacLeo },
  { slug: "virgo", name: "Virgo", symbol: "♍", dateRange: "Aug 23 – Sep 22", icon: ZodiacVirgo },
  { slug: "libra", name: "Libra", symbol: "♎", dateRange: "Sep 23 – Oct 22", icon: ZodiacLibra },
  { slug: "scorpio", name: "Scorpio", symbol: "♏", dateRange: "Oct 23 – Nov 21", icon: ZodiacScorpio },
  { slug: "sagittarius", name: "Sagittarius", symbol: "♐", dateRange: "Nov 22 – Dec 21", icon: ZodiacSagittarius },
  { slug: "capricorn", name: "Capricorn", symbol: "♑", dateRange: "Dec 22 – Jan 19", icon: ZodiacCapricorn },
  { slug: "aquarius", name: "Aquarius", symbol: "♒", dateRange: "Jan 20 – Feb 18", icon: ZodiacAquarius },
  { slug: "pisces", name: "Pisces", symbol: "♓", dateRange: "Feb 19 – Mar 20", icon: ZodiacPisces },
];