import BlaxelLogo from "../assets/companies/blaxel.png";
import WhalyLogo from "../assets/companies/whaly.png";
import AlturLogo from "../assets/companies/altur.png";
import GolfLogo from "../assets/companies/golf.png";
import WolfiaLogo from "../assets/companies/wolfia.png";
import VybeLogo from "../assets/companies/vybe.png";
import AxoloLogo from "../assets/companies/axolo.png";
import TenXScienceLogo from "../assets/companies/10x-science.png";
import AcoliteLogo from "../assets/companies/acolite.png";
import BluejayLogo from "../assets/companies/bluejay.png";
import AgentPhoneLogo from "../assets/companies/agentphone.png";
import LucisLogo from "../assets/companies/lucis.png";
import MotivesLogo from "../assets/companies/motives.png";
import PelicaLogo from "../assets/companies/pelica.png";
import RationalLogo from "../assets/companies/rational.png";
import TinfoilLogo from "../assets/companies/tinfoil.png";

export interface YCombinatorCompany {
  logo: ImageMetadata;
  badge: string;
  name: string;
  href: string;
  height: number;
}

export const YCombinatorCompanies: YCombinatorCompany[] = [
  {
    logo: TenXScienceLogo,
    badge: "W26",
    name: "10x Science",
    href: "https://10xscience.com",
    height: 24,
  },
  {
    logo: AcoliteLogo,
    badge: "X25",
    name: "Acolite",
    href: "https://acolite.ai",
    height: 24,
  },
  {
    logo: BluejayLogo,
    badge: "X25",
    name: "Bluejay",
    href: "https://getbluejay.ai",
    height: 24,
  },
  {
    logo: AgentPhoneLogo,
    badge: "X26",
    name: "AgentPhone",
    href: "https://agentphone.ai",
    height: 24,
  },
  {
    logo: LucisLogo,
    badge: "X25",
    name: "Lucis",
    href: "https://lucis.life",
    height: 24,
  },
  {
    logo: MotivesLogo,
    badge: "S25",
    name: "Motives",
    href: "https://motives.ai",
    height: 24,
  },
  {
    logo: PelicaLogo,
    badge: "X25",
    name: "Pelica",
    href: "https://pelica.com",
    height: 32,
  },
  {
    logo: RationalLogo,
    badge: "S26",
    name: "Rational",
    href: "https://rational.to",
    height: 24,
  },
  {
    logo: TinfoilLogo,
    badge: "X25",
    name: "Tinfoil",
    href: "https://tinfoil.sh",
    height: 24,
  },
  {
    logo: BlaxelLogo,
    badge: "X25",
    name: "Blaxel",
    href: "https://blaxel.ai",
    height: 24,
  },
  {
    logo: WhalyLogo,
    badge: "S21",
    name: "Whaly",
    href: "https://whaly.io",
    height: 38,
  },
  {
    logo: AlturLogo,
    badge: "S25",
    name: "Altur",
    href: "https://www.altur.io",
    height: 24,
  },
  {
    logo: GolfLogo,
    badge: "X25",
    name: "Golf",
    href: "https://golf.dev",
    height: 24,
  },
  {
    logo: AxoloLogo,
    badge: "W21",
    name: "Axolo",
    href: "https://axolo.co",
    height: 24,
  },
  {
    logo: WolfiaLogo,
    badge: "S22",
    name: "Wolfia",
    href: "https://www.wolfia.com",
    height: 24,
  },
  {
    logo: VybeLogo,
    badge: "X25",
    name: "Vybe",
    href: "https://www.vybe.build",
    height: 24,
  },
];
