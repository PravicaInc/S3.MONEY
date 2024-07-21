import { FC, useEffect } from "react";
import { SidebarItem } from "./types";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./styles.module.css";
import { Typography } from "../Typography";
import { Button } from "../Button";
import { PAGES_URLS } from "../../utils/const.ts";
import OverviewIcon from "../../assets/overview.svg?react";
import ProjectsIcon from "../../assets/projects.svg?react";
import OperationsIcon from "../../assets/operations.svg?react";
import RequestsIcon from "../../assets/requests.svg?react";
import TreasuriesIcon from "../../assets/treasuries.svg?react";
import ReservesIcon from "../../assets/reserves.svg?react";
import DistributorsIcon from "../../assets/distributors.svg?react";
import SettingsIcon from "../../assets/settings.svg?react";
import ExternalLinkIcon from "../../assets/external-link.svg?react";
import HelpIcon from "../../assets/help.svg?react";
import DocsIcon from "../../assets/docs.svg?react";
import PlusIcon from "../../assets/plus.svg?react";

const items: SidebarItem[] = [
  { url: PAGES_URLS.home, label: "Overview", icon: <OverviewIcon /> },
  { url: PAGES_URLS.projects, label: "Projects", icon: <ProjectsIcon /> },
  { url: PAGES_URLS.operations, label: "Operations", icon: <OperationsIcon /> },
  { url: PAGES_URLS.requests, label: "Requests", icon: <RequestsIcon /> },
  { url: PAGES_URLS.treasuries, label: "Treasuries", icon: <TreasuriesIcon /> },
  { url: PAGES_URLS.reserves, label: "Reserves", icon: <ReservesIcon /> },
  { url: PAGES_URLS.distributors, label: "Distributors", icon: <DistributorsIcon /> },
  { url: PAGES_URLS.settings, label: "Settings", icon: <SettingsIcon /> },
  { url: "https://github.com", label: "Help", icon: <HelpIcon /> },
  { url: "https://github.com", label: "Docs", icon: <DocsIcon /> },
];
export const Sidebar: FC = () => {
  const location = useLocation();

  useEffect(() => {
    const activeItem = items.find((item) => item.url === location.pathname);
    if (activeItem) {
      document.title = `S3 - ${activeItem.label}`;
    }
  }, [location]);

  return (
    <div className={styles.container}>
      <div style={{ padding: "0 2.2rem", width: "100%", marginBottom: "3.4rem" }}>
        <Button>
          <PlusIcon />
          <Typography type={"t_sm-600"}>Create New Project</Typography>
        </Button>
      </div>
      <div className={styles.menu}>
        {items.map((item) => (
          <RenderMenuItems item={item} key={item.url} />
        ))}
      </div>
    </div>
  );
};

interface IRenderMenuItemsProps {
  item: SidebarItem;
}
const RenderMenuItems: FC<IRenderMenuItemsProps> = ({ item }) => {
  const isFullURL = item.url.includes("https");

  return (
    <NavLink to={item.url} target={isFullURL ? "_blank" : ""} className={styles.navigationItemWrapper}>
      {({ isActive }) => (
        <div className={`${styles.navigationItem} ${isActive && styles.isActive}`}>
          {item.icon}
          <Typography style={{ color: "inherit" }} type={`t_md-500`}>
            {item.label}
          </Typography>
          {isFullURL && <ExternalLinkIcon />}
        </div>
      )}
    </NavLink>
  );
};
