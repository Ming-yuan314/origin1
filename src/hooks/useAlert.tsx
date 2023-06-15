import styled from '@emotion/styled';
// import {ReactComponent as SuccessSvg} from 'static/img/notice_success.svg'
// import {ReactComponent as NoticeSvg} from 'static/img/notice_normal.svg'
// import {ReactComponent as ErrorSvg} from 'static/img/notice_error.svg'
// import {ReactComponent as LinkSvg} from 'static/img/notice_link.svg'
// import {ReactComponent as CloseSvg} from 'static/img/notice_close.svg'
import clsx from 'clsx';
import _capitalize from 'lodash/capitalize';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface AlertProps {
  type: '' | 'success' | 'error' | 'notice' | 'warning';
  labelText?: string;
  message: string;
  link?: string;
}

export default function useAlert() {
  const [alertData, setAlert] = useState<AlertProps>({
    type: '',
    message: '',
  });

  useEffect(() => {
    if (alertData.type) {
      MySwal.fire({
        html: (
          <NoticeContainer>
            <div className={clsx(alertData.type, 'notice-type-label')}>
              {_capitalize(alertData.labelText || alertData.type)}
            </div>

            <div className="message-content">
              <div className="message">{alertData.message}</div>
              {alertData.link ? (
                <a
                  href={alertData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hash-link"
                >
                  View on explorer
                </a>
              ) : null}
            </div>
          </NoticeContainer>
        ),
        position: 'bottom-right',
        showConfirmButton: false,
        timer: 5000,
        backdrop: false,
        customClass: {
          container: `toastContainer ${alertData.type}`,
        },
        showCloseButton: true,
        closeButtonHtml: <div>X</div>,
        showClass: {
          popup: 'fadeIn',
          // backdrop: 'swal2-backdrop-show',
          // icon: 'swal2-icon-show'
        },
        hideClass: {
          popup: 'fadeOut',
          backdrop: 'swal2-backdrop-hide',
          icon: 'swal2-icon-hide',
        },
      });
    }

    // return () => {

    // }
  }, [alertData]);

  return { setAlert };
}

const NoticeContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;

  .notice-type-label {
    padding: 0 16px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    color: #353a12;
    border-radius: 4px;
    background: #28aed8;

    &.warning {
      background: #f2b440;
    }
    &.success {
      background: #80c93d;
    }
    &.error {
      background: #bd4741;
      color: #ffffff;
    }
  }
  > svg {
    flex-shrink: 0;
  }

  .message-content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    margin-top: 20px;

    .message {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      display: flex;
      align-items: center;
      color: #dbdcdd;
      word-break: break-word;
    }
    .hash-link {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #518ee2;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      > svg {
        margin-left: 4px;
      }
    }
  }
`;
