import { FC } from 'react';
import { ToastContainer as ReactToastifyContainer, ToastContainerProps } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const ToastContainer: FC<Partial<ToastContainerProps>> = props => (
  <ReactToastifyContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar
    newestOnTop={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    {...props}
  />
);
