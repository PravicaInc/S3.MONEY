import React, { FC } from "react";
import AlertIcon from "../../assets/alert_icon.svg?react";
import { Modal } from "../Modal";

export interface LogoutModalProps {
  children: ((options: { showModal: () => void }) => React.ReactNode) | React.ReactNode;
  onProceed: () => void;
  inProcess?: boolean;
}

export const LogoutModal: FC<LogoutModalProps> = ({ onProceed, inProcess, children }) => (
  <Modal onConfirm={onProceed} element={children} okButtonProps={{ loading: inProcess }} okText={"Logout"}>
    <div className="absolute top-0 left-0 z-[-1]">
      <div className="absolute top-6 left-6 bg-mistyRose w-12 h-12 flex items-center justify-center rounded-full">
        <AlertIcon />
      </div>
    </div>
    <p className="text-primary text-lg font-semibold mt-16">Are you sure to Logout?</p>
    <p className="mt-1 text-secondary">We can't wait to see you again! Please feel free to drop by anytime.</p>
  </Modal>
);
