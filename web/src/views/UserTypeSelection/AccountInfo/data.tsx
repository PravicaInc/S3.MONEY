import { ReactNode } from "react";
import { USER_TYPE } from "../../../types";
import Innovation from "../../../assets/innovation.svg?react";
import Features from "../../../assets/features.svg?react";
import Money from "../../../assets/money.svg?react";
import ProjectManagement from "../../../assets/project-management.svg?react";
import HierarchicalStructure from "../../../assets/hierarchical-structure.svg?react";
import ResourceAllocation from "../../../assets/resource-allocation.svg?react";
import Integration from "../../../assets/integration.svg?react";
import Analytics from "../../../assets/analytics.svg?react";
import Monitor from "../../../assets/monitor.svg?react";
import File from "../../../assets/file.svg?react";
import ControlCenter from "../../../assets/control-center.svg?react";

export const USER_TYPE_INFO: { [key in USER_TYPE]: { title: string; para: string; icon: ReactNode }[] } = {
  "Stablecoin Issuer": [
    {
      title: "Seamless Stablecoin Issuance",
      para: "Launch your stablecoin in minutes, no complex coding required. Sync your bank reserve and S3.money handles the rest.",
      icon: <Money />,
    },
    {
      title: "Effortless Management",
      para: "Track everything in real-time. Our intuitive dashboard keeps supply, demand, and transactions at your fingertips.",
      icon: <ProjectManagement />,
    },
    {
      title: "Granular Control (NEW!)",
      para: "Create secure, multi-layered sub-wallets with Treasuries. Perfect for managing different user types or internal departments.",
      icon: <ResourceAllocation />,
    },
  ],
  Distributor: [
    {
      title: "Effortless Integration",
      para: "Join issuer networks with a few clicks and start distributing stablecoins to your retail customers or partners.",
      icon: <Integration />,
    },
    {
      title: "Simplified Management",
      para: "S3.money provides real-time tracking and management of stablecoins. Monitor volume, track transactions, and reports.",
      icon: <Analytics />,
    },
  ],
  "CBDC Issuer": [
    {
      title: "Effortless Issuance",
      para: "S3.money user-friendly interface eliminates the need for complex smart contract development, saving you time and resources.",
      icon: <Innovation />,
    },
    {
      title: "Customizable Features",
      para: "You can customize CBDC ecosystem. Adjust privacy, transaction limits, and other settings to fit your specific needs.",
      icon: <Features />,
    },
    {
      title: "Hierarchical Control",
      para: "Treasuries feature empowers you to establish secure, multi-layered hierarchies for sub-wallets within your CBDC ecosystem.",
      icon: <HierarchicalStructure />,
    },
  ],
  Regulator: [
    {
      title: "Enhanced Oversight",
      para: "S3.money provides regulators with a transparent audit trail of all stablecoin transactions on Sui blockchain (till now).",
      icon: <Monitor />,
    },
    {
      title: "Streamline Compliance",
      para: "You can easily access real-time and historical data, and overall stablecoins supply, facilitating informed decision-making.",
      icon: <File />,
    },
    {
      title: "Flexible Control",
      para: "S3.money empowers you as a Regulator to define custom parameters and access controls for stablecoin issuers.",
      icon: <ControlCenter />,
    },
  ],
};
