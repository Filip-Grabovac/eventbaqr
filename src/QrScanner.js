import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
// Components
import { Html5QrcodeScanner } from 'html5-qrcode';

export const QRscanner = () => {
  const [ticketState, setState] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [scanningProcess, setScanningProcess] = useState('done');
  const [loader, setLoader] = useState(false);

  // Scanner setup
  useEffect(() => {
    if (scanningProcess !== 'done') return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);
  }, [scanningProcess, success]);

  async function success(ticketId) {
    if (scanningProcess === 'done') {
      setScanningProcess('scanning');
      setLoader(true);

      // Try to find ticket with id and event name, display "Uspjesno"
      try {
        const response = await axios.patch(
          `https://event.ba:5000/api/v1/tickets/tickets_for_64bd92f71d67b5237c608915/${ticketId}`
        );

        setState(response.data.msg);
        setTimeout(() => {
          setState();
          setErrorMsg();
          setScanningProcess('done');
        }, 1500);

        setLoader(false);
        // Dispay "Neuspjesno"
      } catch (error) {
        setErrorMsg(error.response.data.msgInfo);
        setState(error.response.data.msg);
        setTimeout(() => {
          setState();
          setErrorMsg();
          setScanningProcess('done');
        }, 1500);
        setLoader(false);
      }
    }
  }

  function error(err) {
    console.warn(err);
  }

  return (
    <div className="qr-scanner-container">
      {scanningProcess === 'done' && <div id="reader"></div>}
      <div
        className={`qr-message ${
          ticketState === 'Uspješno'
            ? 'success-scan'
            : ticketState === 'Neuspješno'
            ? 'failed-scan'
            : 'scan-in-process'
        }`}
      >
        <p>
          {ticketState !== 'Uspješno' && ticketState !== 'Neuspješno'
            ? 'Skeniraj'
            : ticketState}
        </p>
        {loader ? <span className="loader"></span> : ''}
        <span>{errorMsg ? errorMsg : ''}</span>
      </div>
    </div>
  );
};
